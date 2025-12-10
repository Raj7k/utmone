-- Add priority column to roadmap_items
ALTER TABLE public.roadmap_items ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0;

-- Update existing items with sequential priority based on vote_count
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY vote_count DESC, created_at ASC) as rn
  FROM public.roadmap_items
)
UPDATE public.roadmap_items 
SET priority = ranked.rn
FROM ranked
WHERE public.roadmap_items.id = ranked.id;