-- Create link_drafts table for autosave functionality
CREATE TABLE IF NOT EXISTS link_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  draft_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE link_drafts ENABLE ROW LEVEL SECURITY;

-- Users can only view/manage their own drafts
CREATE POLICY "Users can view their own drafts"
  ON link_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own drafts"
  ON link_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts"
  ON link_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts"
  ON link_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookup
CREATE INDEX idx_link_drafts_user_id ON link_drafts(user_id, updated_at DESC);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_link_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_link_drafts_timestamp
  BEFORE UPDATE ON link_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_link_drafts_updated_at();