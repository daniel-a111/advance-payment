import * as config from '../config';
import { STATUS_SUCC } from "../consts";
import * as debits from '../debits';
import { Processor, Transaction } from "../services/processor";
import { FutureDebit } from "../types";

class Credits {

    processor: Processor;
    bankAccount: string;

    constructor(processor: Processor, bankAccount: string) {
        this.processor = processor;
        if (!bankAccount) {
            throw new Error("bank account cannot be empty");
        }
        this.bankAccount = bankAccount;
    }

    async performAdvance(dstBankAccount: string, amount: number) {
        const id = await this.processor.perform_transaction(this.bankAccount, dstBankAccount, amount, 'credit');
        if (!await this.successfully(id)) {
            throw new Error(`transaction failed (#${id})`);
        }
        this._planRepayment(id, dstBankAccount, amount);
        return id;
    }

    async _planRepayment(id: number, dstBankAccount: string, amount: number) {
        const amountPerDebitTask = amount / 12;
        const futures: FutureDebit[] = [];
        let time = new Date().getTime();
        for (let i = 1; i <= 12; i++) {
            time += config.REPAYMENT_SLOT;
            futures.push({
                parentTransactionId: id,
                release: new Date(time),
                amount: amountPerDebitTask,
                dstBankAccount
            });
        }
        await debits.tasks.regTasks(futures);
    }

    async performDebit(dstBankAccount: string, amount: number) {
        return await this.processor.perform_transaction(this.bankAccount, dstBankAccount, amount, 'debit');
    }

    async successfully(txId: number) {
        const report = await this.processor.download_report();
        const [tx] = report.transactions.filter((t: Transaction) => t.id === txId);
        if (!tx) {
            throw new Error(`transaction id ${txId} not exists`);
        }
        return tx.status === STATUS_SUCC;
    }
}

let credits: Credits | undefined;

export const start = async (processor: Processor, bankAccount: string) => {
    credits = new Credits(processor, bankAccount);
}

export const singletone = () => {
    if (!credits) {
        throw new Error("credits service is not initiated yet");
    }
    return credits;
}