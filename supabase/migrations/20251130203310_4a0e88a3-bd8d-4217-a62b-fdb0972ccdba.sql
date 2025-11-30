-- Fraud Protection: Only count referrals when invited user verifies their email
-- This prevents users from gaming the system with fake emails

-- Function to increment referral count when email is verified
CREATE OR REPLACE FUNCTION increment_referral_on_verification()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  referrer_user_id UUID;
  referrer_data RECORD;
BEGIN
  -- Only proceed if email is being confirmed (email_confirmed_at changes from NULL to a timestamp)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Find the early_access_request for this newly verified user and get their referrer
    SELECT referred_by INTO referrer_user_id
    FROM early_access_requests
    WHERE email = NEW.email
    AND referred_by IS NOT NULL;
    
    -- If this user was referred by someone, increment the referrer's count
    IF referrer_user_id IS NOT NULL THEN
      
      RAISE LOG 'Incrementing referral count for referrer: %', referrer_user_id;
      
      -- Increment the referrer's count using the RPC function
      PERFORM increment_referral_count(referrer_user_id);
      
      -- Check if referrer just unlocked access (hit 3 referrals)
      SELECT referral_count, status, email, name
      INTO referrer_data
      FROM early_access_requests
      WHERE id = referrer_user_id;
      
      -- If they just hit 3 referrals and got auto-approved, log for email notification
      IF referrer_data.referral_count = 3 AND referrer_data.status = 'approved' THEN
        RAISE LOG 'Referrer % unlocked access with 3 verified referrals', referrer_data.email;
        -- The check_referral_unlock trigger will handle status update and badge assignment
      END IF;
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table to detect email verification
-- This trigger fires AFTER email_confirmed_at is updated
DROP TRIGGER IF EXISTS on_email_verification_increment_referral ON auth.users;

CREATE TRIGGER on_email_verification_increment_referral
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION increment_referral_on_verification();

COMMENT ON FUNCTION increment_referral_on_verification() IS 
  'Fraud protection: Only increments referral_count when invited user verifies their email. Prevents fake signup gaming.';