-- Add missing drip campaign schedules for day 2, 5, and 10
-- These trigger automated engagement emails to keep waitlist warm

-- Get the campaign_id (assuming there's one email campaign for drip emails)
DO $$
DECLARE
  v_campaign_id UUID;
BEGIN
  -- Get the first active email campaign (adjust if you have multiple)
  SELECT id INTO v_campaign_id 
  FROM email_campaigns 
  WHERE campaign_type = 'drip' 
  AND is_active = true 
  LIMIT 1;

  -- If no campaign exists, create a default one
  IF v_campaign_id IS NULL THEN
    INSERT INTO email_campaigns (
      campaign_type,
      template_name,
      subject,
      html_content,
      is_active
    ) VALUES (
      'drip',
      'waitlist_engagement',
      'utm.one updates',
      '<p>Engagement email</p>',
      true
    ) RETURNING id INTO v_campaign_id;
  END IF;

  -- Insert day 2 drip schedule (What to expect)
  INSERT INTO drip_campaign_schedules (
    campaign_id,
    trigger_type,
    trigger_hours,
    is_active
  ) VALUES (
    v_campaign_id,
    'hours_after_signup',
    48, -- 2 days
    true
  )
  ON CONFLICT DO NOTHING;

  -- Insert day 5 drip schedule (You're moving up)
  INSERT INTO drip_campaign_schedules (
    campaign_id,
    trigger_type,
    trigger_hours,
    is_active
  ) VALUES (
    v_campaign_id,
    'hours_after_signup',
    120, -- 5 days
    true
  )
  ON CONFLICT DO NOTHING;

  -- Insert day 10 drip schedule (Behind the build)
  INSERT INTO drip_campaign_schedules (
    campaign_id,
    trigger_type,
    trigger_hours,
    is_active
  ) VALUES (
    v_campaign_id,
    'hours_after_signup',
    240, -- 10 days
    true
  )
  ON CONFLICT DO NOTHING;

END $$;