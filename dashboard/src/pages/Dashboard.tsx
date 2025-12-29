import { useState, useEffect, useCallback } from 'react';
import { ExecutionList } from '../components/execution/ExecutionList';
import { ExecutionDetail } from '../components/execution/ExecutionDetail';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import type { Execution } from '../types';

export function Dashboard() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExecutions = useCallback(async () => {
    try {
      const data = await api.getExecutions();
      setExecutions(data);
    } catch (error) {
      console.error('Failed to fetch executions:', error);
    }
  }, []);

  useEffect(() => {
    fetchExecutions();
    const interval = setInterval(fetchExecutions, 5000);
    return () => clearInterval(interval);
  }, [fetchExecutions]);

  const handleRunWorkflow = async () => {
    setLoading(true);
    try {
      const { executionId } = await api.runWorkflow({
        asin: 'B0XYZ123',
        title: 'Stainless Steel Water Bottle 32oz Insulated',
        price: 29.99,
        rating: 4.2,
        reviews: 1247
      });
      setSelectedExecution(executionId);
      await fetchExecutions();
    } catch (error) {
      console.error('Failed to run workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Decision X-Ray</h1>
              <p className="mt-1 text-sm text-gray-500">
                Debug multi-step decision pipelines
              </p>
            </div>
            <Button onClick={handleRunWorkflow} loading={loading} className="text-xs px-3 py-1.5 flex-shrink-0">
              Run Analysis
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className={`lg:col-span-1 ${selectedExecution ? 'hidden lg:block' : ''}`}>
            <ExecutionList
              executions={executions}
              selectedId={selectedExecution}
              onSelect={setSelectedExecution}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedExecution ? (
              <div>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="lg:hidden mb-4 text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  ← Back to list
                </button>
                <ExecutionDetail executionId={selectedExecution} />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center text-gray-500">
                Select an execution to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

