-- Make feedback-screenshots bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'feedback-screenshots';

-- Allow public read access for feedback screenshots
CREATE POLICY "Public read access for feedback screenshots"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'feedback-screenshots');