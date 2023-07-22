import { env } from "process";

import * as dotenv from "dotenv";
import { MIN, WEEK } from "./consts";
dotenv.config({ path: __dirname + '/../.env' });

export const POSTGRES_URI = env.POSTGRES_URI || 'postgres://postgres:123123123@localhost:5432'
export const BANK_ACC = env.BANK_ACC || '';
export const SQL_DEBUG = !!env.SQL_DEBUG;


export const FAILED_RATE_RANDOM = parseFloat(env.FAILED_RATE_RANDOM || '0');

export const REPAYMENT_SLOT = parseInt(env.REPAYMENT_SLOT || '0') || WEEK;
export const MISSING_TASK_DELAY_MS = parseInt(env.MISSING_TASK_DELAY_MS || MIN.toString());
export const PROCESSING_TIMEOUT = parseInt(env.PROCESSING_TIMEOUT || (2 * MIN).toString());