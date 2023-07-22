

import bodyParser from 'body-parser';
import express from 'express';
import * as config from './config';
import * as credits from './credits';
import { MockProcessor } from './mock/processor';
import { sequelize } from './models/connection';
import * as processes from './processes';
import routes from './routes';

const app = express();
const port = 3000;
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb' }));
app.use(bodyParser.json());
app.use('/', routes);


app.listen(port, async () => {
    await sequelize.sync();
    await credits.start(new MockProcessor(), config.BANK_ACC);
    processes.debits.start();
    return console.log(`Express is listening at http://localhost:${port}`);
});
