-- Add new columns to feedback table
ALTER TABLE public.feedback 
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
  ADD COLUMN IF NOT EXISTS browser_info JSONB;

-- Add check constraints
ALTER TABLE public.feedback 
  ADD CONSTRAINT feedback_priority_check CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  ADD CONSTRAINT feedback_category_check CHECK (category IN ('bug', 'feature', 'ui', 'performance', 'question', 'other'));

-- Create storage bucket for feedback screenshots
INSERT INTO storage.buckets (id, name, public) 
VALUES ('feedback-screenshots', 'feedback-screenshots', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for feedback-screenshots bucket
CREATE POLICY "Authenticated users can upload feedback screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'feedback-screenshots');

CREATE POLICY "Authenticated users can view their own feedback screenshots"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'feedback-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);