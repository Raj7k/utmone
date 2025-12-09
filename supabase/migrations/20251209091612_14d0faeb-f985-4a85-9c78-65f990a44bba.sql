-- Add deal value and conversion rate configuration columns to field_events
ALTER TABLE public.field_events 
ADD COLUMN IF NOT EXISTS avg_deal_value numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS conversion_rate numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS use_inferred_values boolean DEFAULT true;