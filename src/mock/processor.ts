
import * as config from '../config';
import { STATUS_FAIL, STATUS_SUCC } from '../consts';
import { logger } from "../logger";
import { Processor, Report } from "../services/processor";


let nextId = 1;
let report: Report = { transactions: [] };
export class MockProcessor extends Processor {

    async perform_transaction(src_bank_account: string, dst_bank_account: string, amount: number, direction: "credit" | "debit"): Promise<number> {
        logger.info(`${src_bank_account} -> ${dst_bank_account}: ${amount} (${direction})`);
        const id = nextId++;
        report.transactions.push({
            id,
            status: randomStatus(),
            src_bank_account, dst_bank_account, amount, direction, date: new Date()
        });
        return id;
    }

    async download_report(): Promise<Report> {
        return deepClone(report);
    }
}

const deepClone = (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
}

const randomStatus = () => {
    return Math.random() > config.FAILED_RATE_RANDOM ? STATUS_SUCC : STATUS_FAIL;
}
