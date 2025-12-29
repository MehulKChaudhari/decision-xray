import { useState, useEffect } from 'react';
import { FaChevronDown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Card, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { api } from '../../services/api';
import type { ExecutionWithSteps, Step, Evaluation } from '../../types';

interface ExecutionDetailProps {
  executionId: string;
}

export function ExecutionDetail({ executionId }: ExecutionDetailProps) {
  const [data, setData] = useState<ExecutionWithSteps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await api.getExecutionById(executionId);
        setData(result);
      } catch (error) {
        console.error('Failed to fetch execution:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [executionId]);

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto" />
        <p className="mt-2 text-gray-500">Loading...</p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center text-gray-500">
        Failed to load execution
      </Card>
    );
  }

  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{data.execution.name}</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{data.execution.description}</p>
          <div className="mt-3 sm:mt-4 flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
            <Badge variant={getStatusVariant(data.execution.status)} className="px-2 sm:px-3 py-1">
            {data.execution.status}
            </Badge>
          <span className="text-gray-500">
            {data.steps.length} steps
          </span>
        </div>
        </CardBody>
      </Card>

      <div className="space-y-4">
        {data.steps.map((step, index) => (
          <StepCard key={step.id} step={step} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasEvaluations = step.evaluations && step.evaluations.length > 0;

  return (
    <Card className="overflow-hidden">
      <div
        className="px-4 sm:px-6 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">
              {index}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">{step.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{step.reasoning}</p>
              {hasEvaluations && (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                  {step.evaluations!.filter(e => e.passed).length} passed, {step.evaluations!.filter(e => !e.passed).length} failed
                </p>
              )}
            </div>
          </div>
          <FaChevronDown
            className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform flex-shrink-0 ${expanded ? 'transform rotate-180' : ''}`}
          />
        </div>
      </div>

      {expanded && (
        <div className="px-4 sm:px-6 pb-3 sm:pb-4 border-t border-gray-200">
          {hasEvaluations && (
            <div className="mt-3 sm:mt-4">
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Evaluations</h4>
              <div className="space-y-2 sm:space-y-3">
                {step.evaluations!.map((evaluation, idx) => (
                  <EvaluationCard key={idx} evaluation={evaluation} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <details className="text-xs sm:text-sm">
              <summary className="cursor-pointer text-gray-700 font-medium hover:text-gray-900">
                View raw data
              </summary>
              <pre className="mt-2 p-2 sm:p-3 bg-gray-50 rounded text-[10px] sm:text-xs overflow-x-auto">
                {JSON.stringify({ input: step.input, output: step.output }, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </Card>
  );
}

function EvaluationCard({ evaluation }: { evaluation: Evaluation }) {
  return (
    <div className={`p-2 sm:p-3 rounded-lg border-2 ${
      evaluation.passed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {evaluation.passed ? (
              <FaCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            ) : (
              <FaTimesCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">{evaluation.itemLabel}</span>
          </div>
          {evaluation.filters && evaluation.filters.length > 0 && (
            <div className="mt-2 space-y-1">
              {evaluation.filters.map((filter, idx) => (
                <div key={idx} className="text-[10px] sm:text-xs text-gray-700 break-words">
                  <span className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 flex-shrink-0 ${
                    filter.passed ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {filter.detail}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

