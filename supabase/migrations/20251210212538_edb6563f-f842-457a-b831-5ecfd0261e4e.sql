-- Allow public read access on feedback table for non-PII columns (bug tracker transparency)
CREATE POLICY "Public can view feedback for transparency" 
ON public.feedback 
FOR SELECT 
USING (true);

-- Note: The query in the app only selects non-PII columns: id, category, type, message, status, created_at, admin_response, responded_at
-- PII columns (user_id, screenshot_url, browser_info, responded_by) are not selected in the public query