import express from 'express';
import * as controllers from '../controllers';

export const router = express.Router();
router.post('/perform_advance', controllers.credits.performAdvance);

