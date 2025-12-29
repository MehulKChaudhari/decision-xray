# decision-xray

Lightweight SDK for capturing decision-making in multi-step pipelines.

## Installation

```bash
npm install decision-xray
```

## Quick Example

```typescript
import { createExecution, recordStep, createEvaluation, createFilterResult } from 'decision-xray';

// Create execution
const execution = createExecution({ name: 'Product Recommendation' });

// Record a step with evaluations
const step = recordStep({
  executionId: execution.id,
  name: 'Price Filter',
  stepType: 'filter',
  input: { candidates: 100 },
  output: { passed: 25 },
  reasoning: 'Filtered products over $50',
  evaluations: [
    createEvaluation('prod-1', 'Product A', false, {
      filters: [
        createFilterResult('price', false, '$75 exceeds maximum $50', 75, 50)
      ]
    })
  ]
});

// You handle persistence
await saveExecution(execution);
await saveStep(step);
```

## API

### createExecution
Creates a new execution with unique ID and timestamp.

### recordStep
Records a decision step with inputs, outputs, reasoning, and optional evaluations.

### createEvaluation
Creates an evaluation for a single candidate (passed/failed, why).

### createFilterResult
Creates a filter result with actual vs expected values.

### completeExecution
Marks an execution as completed or failed.

## Design

- **No I/O**: SDK only creates objects. You handle persistence.
- **Zero dependencies**: Works anywhere.
- **Functional API**: Simple functions, no classes.
- **Domain-agnostic**: Works with any decision pipeline.

See full docs in code comments.
