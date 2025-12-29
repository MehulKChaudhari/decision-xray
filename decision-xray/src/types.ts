export type ExecutionId = string;
export type StepId = string;

export interface Execution {
  id: ExecutionId;
  name: string;
  description?: string;
  status: ExecutionStatus;
  startedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

export type ExecutionStatus = 'running' | 'completed' | 'failed';

export interface Step {
  id: StepId;
  executionId: ExecutionId;
  name: string;
  stepType: string;
  timestamp: Date;
  durationMs?: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reasoning: string;
  metadata?: Record<string, unknown>;
  evaluations?: Evaluation[];
}

export interface Evaluation {
  itemId: string;
  itemLabel: string;
  passed: boolean;
  score?: number;
  filters?: FilterResult[];
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface FilterResult {
  filterName: string;
  passed: boolean;
  detail: string;
  actualValue?: unknown;
  expectedValue?: unknown;
}

export interface CreateExecutionInput {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface RecordStepInput {
  executionId: ExecutionId;
  name: string;
  stepType: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reasoning: string;
  durationMs?: number;
  evaluations?: Evaluation[];
  metadata?: Record<string, unknown>;
}

export interface CompleteExecutionInput {
  status: 'completed' | 'failed';
  metadata?: Record<string, unknown>;
}
