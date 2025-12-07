-- Fix search_path security warning
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
$$ LANGUAGE plpgsql SET search_path = public;