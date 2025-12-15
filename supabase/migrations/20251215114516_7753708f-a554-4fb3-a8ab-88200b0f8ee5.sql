-- Allow public (unauthenticated) users to view published link pages
CREATE POLICY "Public can view published pages"
ON public.link_pages
FOR SELECT
TO public
USING (is_published = true);

-- Also need to allow public access to blocks of published pages
CREATE POLICY "Public can view blocks of published pages"
ON public.link_page_blocks
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.link_pages
    WHERE link_pages.id = link_page_blocks.page_id
    AND link_pages.is_published = true
  )
);

-- Allow public to insert page view/click events (for analytics tracking)
CREATE POLICY "Public can insert page events"
ON public.link_page_events
FOR INSERT
TO public
WITH CHECK (true);