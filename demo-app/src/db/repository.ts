import { supabase } from './client';
import { Execution, Step } from 'decision-xray';

export const saveExecution = async (execution: Execution): Promise<void> => {
  const { error } = await supabase
    .from('executions')
    .upsert({
      id: execution.id,
      name: execution.name,
      description: execution.description,
      status: execution.status,
      started_at: execution.startedAt.toISOString(),
      completed_at: execution.completedAt?.toISOString(),
      metadata: execution.metadata || {}
    });

  if (error) throw error;
};

export const saveStep = async (step: Step): Promise<void> => {
  const { error } = await supabase
    .from('steps')
    .insert({
      id: step.id,
      execution_id: step.executionId,
      name: step.name,
      step_type: step.stepType,
      timestamp: step.timestamp.toISOString(),
      duration_ms: step.durationMs,
      input: step.input,
      output: step.output,
      reasoning: step.reasoning,
      evaluations: step.evaluations || [],
      metadata: step.metadata || {}
    });

  if (error) throw error;
};

export const getExecution = async (executionId: string): Promise<Execution | null> => {
  const { data, error } = await supabase
    .from('executions')
    .select('*')
    .eq('id', executionId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    startedAt: new Date(data.started_at),
    completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    metadata: data.metadata
  };
};

export const getStepsByExecution = async (executionId: string): Promise<Step[]> => {
  const { data, error } = await supabase
    .from('steps')
    .select('*')
    .eq('execution_id', executionId)
    .order('timestamp', { ascending: true });

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    executionId: row.execution_id,
    name: row.name,
    stepType: row.step_type,
    timestamp: new Date(row.timestamp),
    durationMs: row.duration_ms,
    input: row.input,
    output: row.output,
    reasoning: row.reasoning,
    evaluations: row.evaluations,
    metadata: row.metadata
  }));
};

export const getRecentExecutions = async (limit: number = 10): Promise<Execution[]> => {
  const { data, error } = await supabase
    .from('executions')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    startedAt: new Date(row.started_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    metadata: row.metadata
  }));
};

export const getExecutionWithSteps = async (executionId: string) => {
  const execution = await getExecution(executionId);
  
  if (!execution) {
    return null;
  }

  const steps = await getStepsByExecution(executionId);

  return { execution, steps };
};
