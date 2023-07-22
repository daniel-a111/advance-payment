import { NextFunction, Request, Response } from "express";
import { logger } from "../logger";
import { DebitTask } from "../models";

export const allTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks: any[] = await DebitTask.findAll({ raw: true });
        return res.status(200).json({ tasks });
    } catch (e: any) {
        logger.error(e);
        return res.status(500).json({
            message: e?.message || JSON.stringify(e)
        })
    }
}

