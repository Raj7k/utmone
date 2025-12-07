-- Add sales-specific columns to links table
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS prospect_name TEXT,
ADD COLUMN IF NOT EXISTS alert_on_click BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS alert_last_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS link_type TEXT DEFAULT 'marketing';

-- Create index for filtering sales links
CREATE INDEX IF NOT EXISTS idx_links_type_created_by ON links(link_type, created_by);

-- Create sales click alerts table for debouncing and history
CREATE TABLE IF NOT EXISTS public.sales_click_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  prospect_name TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  click_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sales_click_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for sales_click_alerts
CREATE POLICY "Users can view their own sales alerts"
ON public.sales_click_alerts
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Service role can insert sales alerts"
ON public.sales_click_alerts
FOR INSERT
WITH CHECK (true);

-- Index for efficient debounce lookups
CREATE INDEX IF NOT EXISTS idx_sales_alerts_link_sent ON sales_click_alerts(link_id, sent_at DESC);