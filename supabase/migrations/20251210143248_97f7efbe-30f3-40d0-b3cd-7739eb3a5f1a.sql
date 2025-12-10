-- Add response tracking columns to feedback table
ALTER TABLE public.feedback
ADD COLUMN IF NOT EXISTS admin_response TEXT,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS responded_by UUID REFERENCES auth.users(id);

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);