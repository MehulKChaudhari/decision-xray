import { Step, StepId, RecordStepInput, Evaluation, FilterResult } from './types';

const generateStepId = (): StepId => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `step_${timestamp}_${random}`;
};

/**
 * Record a decision step with inputs, outpts, reasoning, and optional evaluations.
 * Returns a step object that you should persist.
 */
export const recordStep = (input: RecordStepInput): Step => {
  return {
    id: generateStepId(),
    executionId: input.executionId,
    name: input.name,
    stepType: input.stepType,
    timestamp: new Date(),
    durationMs: input.durationMs,
    input: input.input,
    output: input.output,
    reasoning: input.reasoning,
    evaluations: input.evaluations,
    metadata: input.metadata
  };
};

/**
 * Create an evaluation for a candidate item.
 * Use this to track pass/fail decisions with optional filters and scoring.
 */
export const createEvaluation = (
  itemId: string,
  itemLabel: string,
  passed: boolean,
  options?: {
    score?: number;
    filters?: FilterResult[];
    reason?: string;
    metadata?: Record<string, unknown>;
  }
): Evaluation => {
  return {
    itemId,
    itemLabel,
    passed,
    score: options?.score,
    filters: options?.filters,
    reason: options?.reason,
    metadata: options?.metadata
  };
};

/**
 * Create a filter result showing why a candidate passed or failed a specific filter.
 * Include actual and expected values for better debugging.
 */
export const createFilterResult = (
  filterName: string,
  passed: boolean,
  detail: string,
  actualValue?: unknown,
  expectedValue?: unknown
): FilterResult => {
  return {
    filterName,
    passed,
    detail,
    actualValue,
    expectedValue
  };
};
