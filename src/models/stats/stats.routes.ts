import { Router } from 'express';
import { statsController } from './stats.controller';

const router = Router();

router.get('/home', statsController.homePageStats);

export const statsRoutes = router;
