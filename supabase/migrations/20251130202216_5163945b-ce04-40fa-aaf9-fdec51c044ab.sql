-- Add referral tracking fields to early_access_requests
ALTER TABLE early_access_requests 
ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS position INTEGER,
ADD COLUMN IF NOT EXISTS unlocked_via_referral BOOLEAN DEFAULT false;

-- Create index for efficient referral lookups
CREATE INDEX IF NOT EXISTS idx_early_access_referral_code ON early_access_requests(referral_code);
CREATE INDEX IF NOT EXISTS idx_early_access_referred_by ON early_access_requests(referred_by);
CREATE INDEX IF NOT EXISTS idx_early_access_status_position ON early_access_requests(status, position);

-- Function to update waitlist positions
CREATE OR REPLACE FUNCTION update_waitlist_positions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  WITH ranked_requests AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        ORDER BY 
          CASE 
            WHEN status = 'approved' THEN 0
            WHEN unlocked_via_referral THEN 1
            ELSE 2
          END,
          total_access_score DESC,
          created_at ASC
      ) as new_position
    FROM early_access_requests
    WHERE status != 'rejected'
  )
  UPDATE early_access_requests
  SET position = ranked_requests.new_position
  FROM ranked_requests
  WHERE early_access_requests.id = ranked_requests.id;
END;
$$;

-- Trigger to auto-unlock when referral threshold is met
CREATE OR REPLACE FUNCTION check_referral_unlock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user hit the unlock threshold (3 referrals)
  IF NEW.referral_count >= 3 AND NEW.status = 'pending' AND NOT NEW.unlocked_via_referral THEN
    -- Update to approved status
    NEW.status := 'approved';
    NEW.unlocked_via_referral := true;
    NEW.approval_timestamp := NOW();
    
    -- Assign founding member badge
    NEW.badge := 'founding_member';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on early_access_requests
DROP TRIGGER IF EXISTS trigger_check_referral_unlock ON early_access_requests;
CREATE TRIGGER trigger_check_referral_unlock
  BEFORE UPDATE OF referral_count
  ON early_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION check_referral_unlock();

-- Function to increment referral count
CREATE OR REPLACE FUNCTION increment_referral_count(referrer_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE early_access_requests
  SET referral_count = referral_count + 1
  WHERE id = referrer_id;
  
  -- Update positions after referral
  PERFORM update_waitlist_positions();
END;
$$;

-- Add credit_months to profiles for Pro plan reward
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS credit_months INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by_code TEXT;