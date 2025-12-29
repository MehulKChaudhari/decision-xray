import { Badge } from '../ui/Badge';
import { Card, CardHeader } from '../ui/Card';
import type { Execution } from '../../types';

interface ExecutionListProps {
  executions: Execution[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ExecutionList({ executions, selectedId, onSelect }: ExecutionListProps) {
  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'running':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (isToday) {
      return `Today at ${timeStr}`;
    }
    
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
    
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-base sm:text-lg font-medium text-gray-900">Executions</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">{executions.length} total</p>
      </CardHeader>
      <ul className="divide-y divide-gray-200 max-h-[calc(100vh-20rem)] sm:max-h-[calc(100vh-16rem)] overflow-y-auto">
        {executions.map((execution) => (
          <li
            key={execution.id}
            onClick={() => onSelect(execution.id)}
            className={`px-3 sm:px-4 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 transition ${
              selectedId === execution.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {execution.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate mt-1">
                  {execution.description}
                </p>
              </div>
              <Badge variant={getStatusVariant(execution.status)} className="text-[10px] sm:text-xs">
                {execution.status}
              </Badge>
            </div>
            <div className="mt-2 text-[10px] sm:text-xs text-gray-500">
              {formatTime(execution.startedAt)}
            </div>
          </li>
        ))}
        {executions.length === 0 && (
          <li className="px-4 py-8 text-center text-gray-500">
            No executions yet. Click "Run Analysis" to start.
          </li>
        )}
      </ul>
    </Card>
  );
}

