-- Create storage bucket for link page avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('link-page-avatars', 'link-page-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'link-page-avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own avatars
CREATE POLICY "Users can update avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'link-page-avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own avatars
CREATE POLICY "Users can delete avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'link-page-avatars' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to avatars
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'link-page-avatars');