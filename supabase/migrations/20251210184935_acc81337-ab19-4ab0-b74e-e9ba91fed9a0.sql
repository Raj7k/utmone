-- Add lead qualification fields to event_badge_scans
ALTER TABLE public.event_badge_scans 
ADD COLUMN IF NOT EXISTS lead_temperature text CHECK (lead_temperature IN ('hot', 'warm', 'cold')),
ADD COLUMN IF NOT EXISTS quick_notes text,
ADD COLUMN IF NOT EXISTS voice_note_url text,
ADD COLUMN IF NOT EXISTS voice_note_transcript text;

-- Add index for filtering by temperature
CREATE INDEX IF NOT EXISTS idx_event_badge_scans_temperature ON public.event_badge_scans(lead_temperature);

-- Add comment for documentation
COMMENT ON COLUMN public.event_badge_scans.lead_temperature IS 'Lead qualification: hot (ready to buy), warm (interested), cold (info only)';