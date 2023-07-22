import * as config from '../config';
import * as credits from '../credits';
import { tasks } from '../debits';
import { logger } from "../logger";

export const start = () => {
    processTask();
}

const processTask = async () => {
    let task: any;
    task = await tasks.findNextReady();
    if (task) {
        credits.singletone()
            .performDebit(task.dstBankAccount, task.amount)
            .then(async (txId: number) => {
                if (await credits.singletone().successfully(txId)) {
                    tasks.setAsDone(task);
                } else {
                    tasks.setAsFailed(task);
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

const sleep = (ms: number) => {
    return new Promise((acc) => {
        setTimeout(() => {
            acc(true);
        }, ms);
    })
}