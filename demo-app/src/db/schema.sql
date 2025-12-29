DROP TABLE IF EXISTS steps CASCADE;
DROP TABLE IF EXISTS executions CASCADE;

CREATE TABLE executions (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE steps (
  id VARCHAR(255) PRIMARY KEY,
  execution_id VARCHAR(255) NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  step_type VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  duration_ms INTEGER,
  input JSONB NOT NULL,
  output JSONB NOT NULL,
  reasoning TEXT NOT NULL,
  evaluations JSONB,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_executions_status ON executions(status);
CREATE INDEX idx_executions_started_at ON executions(started_at DESC);
CREATE INDEX idx_steps_execution_id ON steps(execution_id);
CREATE INDEX idx_steps_step_type ON steps(step_type);
CREATE INDEX idx_steps_timestamp ON steps(timestamp);

ALTER TABLE executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON executions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON steps FOR ALL USING (true) WITH CHECK (true);
