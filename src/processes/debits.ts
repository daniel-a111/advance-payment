import { Mutex } from "async-mutex";
import { Op } from "sequelize";
import * as config from '../config';
import { STATUS_FAIL, STATUS_NEW, STATUS_PROC, STATUS_SUCC } from "../consts";
import * as credits from '../credits';
import { logger } from "../logger";
import { DebitTask, sequelize } from "../models";


export const start = () => {
    processTask();
}

const processTask = async () => {
    let task: any;
    task = await findNextReady();
    if (task) {
        credits.singletone()
            .performDebit(task.dstBankAccount, task.amount)
            .then(async (txId: number) => {
                if (await credits.singletone().successfully(txId)) {
                    setAsDone(task);
                } else {
                    setAsFailed(task);
                }
            })
            .catch((err: any) => {
                logger.error(err.message || JSON.stringify(err));
            });
    } else {
        await sleep(config.MISSING_TASK_DELAY_MS);
    }
    processTask();
}

const findNextReady = async () => {
    logger.info(`looking for next task...`);
    const mutex = new Mutex();
    const release = await mutex.acquire();
    try {
        const task: any = await DebitTask.findOne({
            where: {
                ...futureDebitCond(),
                release: {
                    [Op.lte]: sequelize.literal('NOW()')
                }
            }
        });
        if (task) {
            logger.info(`task found: ${task.id}`);
            task.set('status', STATUS_PROC);
            await task.save();
        }
        return task;
    } catch (e: any) {
        logger.error(e?.message || JSON.stringify(e));
    } finally {
        release();
    }
}

const setAsDone = async (task: any) => {
    logger.info(`mark task #${task.id} as done`);
    task.set('status', STATUS_SUCC);
    await task.save();
}

const setAsFailed = async (task: any) => {
    const mutex = new Mutex();
    const release = await mutex.acquire();
    try {
        const last = await getLastOpenByParent(task.parentTransactionId);
        const release = new Date(last.getTime() + config.REPAYMENT_SLOT);
        logger.info(`mark task #${task.id} as failed. repayment on ${release}`);
        task.set('release', release);
        task.set('status', STATUS_FAIL);
    } catch (e: any) {
        logger.error(e?.message || JSON.stringify(e));
    } finally {
        await task.save();
        release();
    }
}

const getLastOpenByParent = async (parentTransactionId: number): Promise<Date> => {
    let [lastTask]: any[] = await DebitTask.findAll({
        where: {
            ...futureDebitCond(),
        }, order: [['release', 'DESC']], limit: 1
    });
    if (!lastTask) {
        [lastTask] = await DebitTask.findAll({ where: { status: STATUS_SUCC }, order: [['release', 'DESC']], limit: 1 });
    }
    if (!lastTask) {
        throw new Error(`no parent transaction ${parentTransactionId}`);
    }
    return lastTask.release;
}

const futureDebitCond = (): any => {
    return {
        [Op.or]: [{
            status: STATUS_NEW
        }, {
            status: STATUS_FAIL
        }]
    }
}

const sleep = (ms: number) => {
    return new Promise((acc) => {
        setTimeout(() => {
            acc(true);
        }, ms);
    })
}