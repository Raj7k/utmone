-- Add contextual routing columns to links table
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS contextual_routing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS routing_strategy TEXT DEFAULT 'global' CHECK (routing_strategy IN ('global', 'contextual'));

-- Create link_bandits table for LinUCB algorithm state
CREATE TABLE IF NOT EXISTS link_bandits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  destination_index INTEGER NOT NULL,
  context_key TEXT NOT NULL, -- e.g. "mobile_ios_us", "desktop_android_gb"
  a_matrix JSONB NOT NULL DEFAULT '[[1,0,0],[0,1,0],[0,0,1]]', -- 3x3 identity matrix
  b_vector JSONB NOT NULL DEFAULT '[0,0,0]', -- 3D zero vector
  impressions INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(link_id, destination_index, context_key)
);

CREATE INDEX idx_link_bandits_link_id ON link_bandits(link_id);
CREATE INDEX idx_link_bandits_context ON link_bandits(link_id, context_key);

COMMENT ON TABLE link_bandits IS 'Stores learned weights for contextual bandit (LinUCB) routing';
COMMENT ON COLUMN link_bandits.a_matrix IS 'A matrix for LinUCB: stores context covariance';
COMMENT ON COLUMN link_bandits.b_vector IS 'b vector for LinUCB: stores context-reward accumulation';
COMMENT ON COLUMN link_bandits.context_key IS 'Context identifier: mobile/desktop_ios/android/other_us/gb/other';