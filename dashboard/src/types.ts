export interface Execution {
  id: string;
  name: string;
  description?: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface Step {
  id: string;
  executionId: string;
  name: string;
  stepType: string;
  timestamp: string;
  durationMs?: number;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  reasoning: string;
  evaluations?: Evaluation[];
  metadata?: Record<string, unknown>;
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

export interface ExecutionWithSteps {
  execution: Execution;
  steps: Step[];
}

