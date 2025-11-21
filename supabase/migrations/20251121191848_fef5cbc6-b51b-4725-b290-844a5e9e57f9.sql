-- Create user_preferences table for storing per-workspace user preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Last used values
  last_domain TEXT,
  last_path TEXT,
  last_utm_source TEXT,
  last_utm_medium TEXT,
  last_utm_campaign TEXT,
  
  -- Preferences
  preferred_domain TEXT,
  preferred_path TEXT,
  auto_generate_slug BOOLEAN DEFAULT true,
  auto_populate_utm BOOLEAN DEFAULT true,
  default_redirect_type TEXT DEFAULT '302',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, workspace_id)
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_preferences_user_workspace 
  ON public.user_preferences(user_id, workspace_id);