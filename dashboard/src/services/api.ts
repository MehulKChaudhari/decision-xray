import type { Execution, ExecutionWithSteps } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const api = {
  async getExecutions(): Promise<Execution[]> {
    const res = await fetch(`${API_BASE}/api/executions`);
    const data: ApiResponse<Execution[]> = await res.json();
    if (!data.success) throw new Error('Failed to fetch executions');
    return data.data;
  },

  async getExecutionById(id: string): Promise<ExecutionWithSteps> {
    const res = await fetch(`${API_BASE}/api/executions/${id}`);
    const data: ApiResponse<ExecutionWithSteps> = await res.json();
    if (!data.success) throw new Error('Failed to fetch execution');
    return data.data;
  },

  async runWorkflow(referenceProduct: {
    asin: string;
    title: string;
    price: number;
    rating: number;
    reviews: number;
  }): Promise<{ executionId: string }> {
    const res = await fetch(`${API_BASE}/api/executions/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceProduct })
    });
    const data: ApiResponse<{ executionId: string }> = await res.json();
    if (!data.success) throw new Error('Failed to run workflow');
    return data.data;
  }
};

