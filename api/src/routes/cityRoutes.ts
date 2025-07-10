import { Router } from 'express';

import { getCityInfo } from '../controllers/cityController';
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
});

const router = Router();

router.get('/city/:city', limiter, getCityInfo);

export default router;

