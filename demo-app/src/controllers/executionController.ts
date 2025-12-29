import { Request, Response } from 'express';
import { getRecentExecutions, getExecutionWithSteps } from '../db/repository';
import { runCompetitorSelection } from '../workflows/competitorSelection';

export const listExecutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const executions = await getRecentExecutions(limit);
    
    res.json({ success: true, data: executions });
  } catch (error) {
    console.error('Error fetching executions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch executions' });
  }
};

export const getExecutionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await getExecutionWithSteps(id);
    
    if (!result) {
      res.status(404).json({ success: false, error: 'Execution not found' });
      return;
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching execution:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch execution' });
  }
};

export const runWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { referenceProduct } = req.body;
    
    if (!referenceProduct) {
      res.status(400).json({ success: false, error: 'referenceProduct is required' });
      return;
    }

    const required = ['asin', 'title', 'price', 'rating', 'reviews'];
    for (const field of required) {
      if (!(field in referenceProduct)) {
        res.status(400).json({ success: false, error: `referenceProduct.${field} is required` });
        return;
      }
    }

    const result = await runCompetitorSelection(referenceProduct);
    
    res.json({
      success: true,
      data: {
        executionId: result.execution.id,
        execution: result.execution,
        stepsCount: result.steps.length
      }
    });
  } catch (error) {
    console.error('Error running workflow:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run workflow'
    });
  }
};
