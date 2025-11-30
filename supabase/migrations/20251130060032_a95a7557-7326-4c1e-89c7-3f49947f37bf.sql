-- Add campaign_id to link_clicks for denormalized querying
ALTER TABLE link_clicks ADD COLUMN campaign_id uuid REFERENCES campaigns(id) ON DELETE SET NULL;

-- Create trigger function to auto-populate campaign_id from link
CREATE OR REPLACE FUNCTION set_click_campaign_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.campaign_id IS NULL THEN
    SELECT campaign_id INTO NEW.campaign_id 
    FROM links WHERE id = NEW.link_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create trigger to auto-populate campaign_id on click insert
CREATE TRIGGER trigger_set_click_campaign_id
BEFORE INSERT ON link_clicks
FOR EACH ROW
EXECUTE FUNCTION set_click_campaign_id();

-- Create index for fast campaign analytics queries
CREATE INDEX idx_link_clicks_campaign_id ON link_clicks(campaign_id) WHERE campaign_id IS NOT NULL;