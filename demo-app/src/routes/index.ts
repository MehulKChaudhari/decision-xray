import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import executionRoutes from './executionRoutes';

const router: Router = Router();

router.get('/health', getHealth);
router.use('/api/executions', executionRoutes);

export default router;

