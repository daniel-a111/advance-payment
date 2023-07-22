import { DataTypes } from "sequelize";
import { STATUS_FAIL, STATUS_NEW, STATUS_PROC, STATUS_SUCC } from "../consts";
import * as conn from "./connection";

export const sequelize = conn.sequelize;

export const DebitTask = sequelize.define("debit_task", {
    parentTransactionId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    release: DataTypes.DATE,
    amount: DataTypes.REAL,
    dstBankAccount: DataTypes.STRING,
    status: {
        type: DataTypes.ENUM(STATUS_NEW, STATUS_PROC, STATUS_SUCC, STATUS_FAIL),
        defaultValue: STATUS_NEW
    },
    message: DataTypes.STRING
});

