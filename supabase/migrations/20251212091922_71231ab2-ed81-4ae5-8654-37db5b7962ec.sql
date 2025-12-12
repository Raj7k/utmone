-- Change identity_edges visitor columns from UUID to TEXT to support string visitor IDs (v_xxx format)
ALTER TABLE public.identity_edges 
  ALTER COLUMN source_visitor_id TYPE TEXT USING source_visitor_id::TEXT,
  ALTER COLUMN target_visitor_id TYPE TEXT USING target_visitor_id::TEXT;