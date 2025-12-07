-- Auto-create pixel_config when workspace is created
CREATE OR REPLACE FUNCTION public.auto_create_pixel_config()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pixel_configs (workspace_id, pixel_id, created_by, domain_whitelist, is_active)
  VALUES (
    NEW.id,
    'utm_' || substring(md5(random()::text || clock_timestamp()::text) from 1 for 12),
    NEW.owner_id,
    '{}',
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on workspace creation
DROP TRIGGER IF EXISTS on_workspace_created_create_pixel ON public.workspaces;
CREATE TRIGGER on_workspace_created_create_pixel
  AFTER INSERT ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.auto_create_pixel_config();

-- Backfill: Create pixel_configs for existing workspaces that don't have one
INSERT INTO public.pixel_configs (workspace_id, pixel_id, created_by, domain_whitelist, is_active)
SELECT 
  w.id,
  'utm_' || substring(md5(random()::text || w.id::text) from 1 for 12),
  w.owner_id,
  '{}',
  true
FROM public.workspaces w
LEFT JOIN public.pixel_configs pc ON pc.workspace_id = w.id
WHERE pc.id IS NULL;