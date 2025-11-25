-- utm.one Self-Hosted Database Functions
-- Helper functions for redirect service

-- Function to increment link click counts
CREATE OR REPLACE FUNCTION increment_link_clicks(
    p_link_id UUID,
    p_total_increment INTEGER,
    p_unique_increment INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE links
    SET 
        total_clicks = COALESCE(total_clicks, 0) + p_total_increment,
        unique_clicks = COALESCE(unique_clicks, 0) + p_unique_increment,
        last_clicked_at = NOW()
    WHERE id = p_link_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate verification code for domains
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
BEGIN
    RETURN 'utm_' || substr(md5(random()::text), 1, 16);
END;
$$ LANGUAGE plpgsql;

-- Trigger to set verification code on domain insert
CREATE OR REPLACE FUNCTION set_domain_verification_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.verification_code IS NULL THEN
        NEW.verification_code := generate_verification_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_domain_verification
    BEFORE INSERT ON domains
    FOR EACH ROW
    EXECUTE FUNCTION set_domain_verification_code();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_links_updated_at
    BEFORE UPDATE ON links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
