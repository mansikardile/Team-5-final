import { Router } from 'express';
import { getTechLabs } from '../controllers/techlab.controller.js';

const router = Router();

router.get('/', getTechLabs);

export default router;
