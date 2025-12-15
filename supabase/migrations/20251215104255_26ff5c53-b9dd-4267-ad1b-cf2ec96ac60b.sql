-- Create verification_requests table for Instagram-style verification
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  
  -- Contact info (prerequisites)
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- KYC Details
  full_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('id_card', 'passport', 'drivers_license', 'business_license')),
  document_url TEXT,
  business_name TEXT,
  business_website TEXT,
  category TEXT CHECK (category IN ('creator', 'business', 'public_figure', 'brand', 'organization')),
  reason_for_verification TEXT NOT NULL,
  social_links JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_verification_requests_user_id ON public.verification_requests(user_id);
CREATE INDEX idx_verification_requests_workspace_id ON public.verification_requests(workspace_id);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);

-- Enable RLS
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification requests
CREATE POLICY "Users can view own verification requests"
ON public.verification_requests
FOR SELECT
USING (user_id = auth.uid());

-- Users can create verification requests for their workspaces
CREATE POLICY "Users can create verification requests"
ON public.verification_requests
FOR INSERT
WITH CHECK (user_id = auth.uid() AND has_workspace_access(auth.uid(), workspace_id));

-- Admins can view all verification requests
CREATE POLICY "Admins can view all verification requests"
ON public.verification_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update verification requests (approve/reject)
CREATE POLICY "Admins can update verification requests"
ON public.verification_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for verification documents
CREATE POLICY "Users can upload verification documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'verification-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own verification documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'verification-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all verification documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'verification-documents' AND has_role(auth.uid(), 'admin'::app_role));

-- Add feature gate for verified badge (Growth+ plans only)
INSERT INTO public.feature_gates (feature_key, min_plan_tier, description)
VALUES ('verified_badge', 'growth', 'Apply for Instagram-style verified badge on Link Pages')
ON CONFLICT (feature_key) DO NOTHING;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_verification_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_verification_requests_timestamp
BEFORE UPDATE ON public.verification_requests
FOR EACH ROW
EXECUTE FUNCTION update_verification_requests_updated_at();