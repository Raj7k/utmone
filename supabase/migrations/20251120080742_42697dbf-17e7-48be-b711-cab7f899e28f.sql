-- Add A/B test tracking fields to links table
ALTER TABLE public.links
ADD COLUMN ab_test_status text DEFAULT 'inactive' CHECK (ab_test_status IN ('inactive', 'running', 'completed')),
ADD COLUMN ab_test_winner_id uuid REFERENCES public.og_image_variants(id) ON DELETE SET NULL,
ADD COLUMN ab_test_started_at timestamp with time zone,
ADD COLUMN ab_test_completed_at timestamp with time zone,
ADD COLUMN ab_test_confidence_threshold numeric DEFAULT 0.95 CHECK (ab_test_confidence_threshold >= 0 AND ab_test_confidence_threshold <= 1),
ADD COLUMN ab_test_min_clicks integer DEFAULT 100;

-- Create index for faster lookups of running tests
CREATE INDEX idx_links_ab_test_status ON public.links(ab_test_status) WHERE ab_test_status = 'running';