

type txStatus = 'SUCCESS' | 'FAILED';
export type Direction = 'credit' | 'debit';

export interface Report {
    transactions: Transaction[];
}

export interface Transaction {
    id: number;
    date: Date;
    src_bank_account: string;
    dst_bank_account: string;
    amount: number;
    direction: Direction;
    status: txStatus;
}


export abstract class Processor {

    abstract perform_transaction(src_bank_account: string, dst_bank_account: string, amount: number, direction: Direction): Promise<number>;

    abstract download_report(): Promise<Report>;
}
