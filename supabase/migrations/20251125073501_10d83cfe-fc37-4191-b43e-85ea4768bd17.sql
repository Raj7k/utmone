-- Fix search_path for log_link_change function
CREATE OR REPLACE FUNCTION public.log_link_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.link_change_history (link_id, changed_by, change_type, metadata)
    VALUES (NEW.id, NEW.created_by, 'created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'status_changed', 'status', OLD.status::TEXT, NEW.status::TEXT);
    END IF;
    IF OLD.approval_status IS DISTINCT FROM NEW.approval_status THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'approval_status_changed', 'approval_status', OLD.approval_status, NEW.approval_status);
    END IF;
    IF OLD.destination_url IS DISTINCT FROM NEW.destination_url THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'updated', 'destination_url', OLD.destination_url, NEW.destination_url);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.link_change_history (link_id, changed_by, change_type, metadata)
    VALUES (OLD.id, COALESCE(auth.uid(), OLD.created_by), 'deleted', to_jsonb(OLD));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;