import { NextFunction, Request, Response } from "express";
import * as credits from '../credits';
import { logger } from "../logger";

interface PerformAdvanveForm {
    dst_bank_account: string; amount: number;
}

export const performAdvance = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { dst_bank_account, amount }: PerformAdvanveForm = req.body;
        const transactionId = await credits.singletone().performAdvance(dst_bank_account, amount);
        return res.status(200).json({ success: true, transactionId });
    } catch (e: any) {
        logger.error(e);
        return res.status(500).json({
            message: e?.message || JSON.stringify(e)
        })
    }
}

