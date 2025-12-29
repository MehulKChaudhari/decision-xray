import { Router } from 'express';
import { listExecutions, getExecutionById, runWorkflow } from '../controllers/executionController';

const router: Router = Router();

router.get('/', listExecutions);
router.get('/:id', getExecutionById);
router.post('/run', runWorkflow);

export default router;
