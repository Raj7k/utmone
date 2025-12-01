-- Add health monitoring fields to links table
ALTER TABLE links
ADD COLUMN IF NOT EXISTS fallback_url TEXT,
ADD COLUMN IF NOT EXISTS health_status TEXT DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'unhealthy', 'unknown')),
ADD COLUMN IF NOT EXISTS last_health_check TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS health_check_failures INTEGER DEFAULT 0;

-- Create index for health check queries
CREATE INDEX IF NOT EXISTS idx_links_health_check ON links(health_status, last_health_check) WHERE status = 'active';

-- Create link_health_logs table to track health check history
CREATE TABLE IF NOT EXISTS link_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_code INTEGER,
  response_time_ms INTEGER,
  is_healthy BOOLEAN,
  error_message TEXT,
  redirect_chain TEXT[],
  final_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_link_health_logs_link_id ON link_health_logs(link_id, checked_at DESC);