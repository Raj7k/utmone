-- Create trigger function to automatically sync click counts to links table
CREATE OR REPLACE FUNCTION update_link_click_counts()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE links
  SET 
    total_clicks = (SELECT COUNT(*) FROM link_clicks WHERE link_id = NEW.link_id),
    unique_clicks = (SELECT COUNT(*) FROM link_clicks WHERE link_id = NEW.link_id AND is_unique = true),
    last_clicked_at = NEW.clicked_at
  WHERE id = NEW.link_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on link_clicks table
DROP TRIGGER IF EXISTS sync_link_click_counts ON link_clicks;
CREATE TRIGGER sync_link_click_counts
AFTER INSERT ON link_clicks
FOR EACH ROW
EXECUTE FUNCTION update_link_click_counts();

-- Backfill existing links with correct click counts
UPDATE links
SET 
  total_clicks = COALESCE((SELECT COUNT(*) FROM link_clicks WHERE link_id = links.id), 0),
  unique_clicks = COALESCE((SELECT COUNT(*) FROM link_clicks WHERE link_id = links.id AND is_unique = true), 0),
  last_clicked_at = (SELECT MAX(clicked_at) FROM link_clicks WHERE link_id = links.id)
WHERE id IN (SELECT DISTINCT link_id FROM link_clicks);