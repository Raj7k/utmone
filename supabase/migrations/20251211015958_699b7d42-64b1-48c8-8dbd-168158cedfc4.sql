-- Create storage bucket for architect stamps
INSERT INTO storage.buckets (id, name, public)
VALUES ('architect-stamps', 'architect-stamps', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Public read access for architect stamps"
ON storage.objects FOR SELECT
USING (bucket_id = 'architect-stamps');

-- Create policy for authenticated upload (edge functions use service role)
CREATE POLICY "Service role can upload architect stamps"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'architect-stamps');

-- Create policy for service role update
CREATE POLICY "Service role can update architect stamps"
ON storage.objects FOR UPDATE
USING (bucket_id = 'architect-stamps');