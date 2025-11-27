-- Add click_hour column to link_clicks for "Best Time to Post" analytics
ALTER TABLE public.link_clicks 
ADD COLUMN IF NOT EXISTS click_hour INTEGER;

-- Add index for click_hour analytics queries
CREATE INDEX IF NOT EXISTS idx_link_clicks_click_hour 
ON public.link_clicks(click_hour) 
WHERE click_hour IS NOT NULL;

-- Add composite index for day-of-week and hour heatmap queries
CREATE INDEX IF NOT EXISTS idx_link_clicks_time_analytics 
ON public.link_clicks(link_id, clicked_at, click_hour);

-- Add comment explaining the column
COMMENT ON COLUMN public.link_clicks.click_hour IS 'Hour of day (0-23) when click occurred, extracted from clicked_at for analytics';