import { 
  Execution, 
  ExecutionId, 
  CreateExecutionInput, 
  CompleteExecutionInput 
} from './types';

const generateExecutionId = (): ExecutionId => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `exec_${timestamp}_${random}`;
};

/**
 * Create a new execution. Returns an execution object with status 'running'.
 * You're responsible for persisting it.
 */
export const createExecution = (input: CreateExecutionInput): Execution => {
  return {
    id: generateExecutionId(),
    name: input.name,
    description: input.description,
    status: 'running',
    startedAt: new Date(),
    metadata: input.metadata
  };
};

/**
 * Mark an execution as completed or failed.
 * Returns a new execution object with updated status and completedAt timestamp.
 */
export const completeExecution = (
  execution: Execution,
  input: CompleteExecutionInput
): Execution => {
  return {
    ...execution,
    status: input.status,
    completedAt: new Date(),
    metadata: {
      ...execution.metadata,
      ...input.metadata
    }
  };
};
