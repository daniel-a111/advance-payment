import express from 'express';

import * as credits from './credits';
import * as debits from './debits';

const router = express.Router();

router.use('/', credits.router);
router.use('/', debits.router);

export = router;
