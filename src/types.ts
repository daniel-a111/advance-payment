export interface FutureDebit {
    parentTransactionId: number;
    release: Date;
    amount: number;
    dstBankAccount: string;
}
