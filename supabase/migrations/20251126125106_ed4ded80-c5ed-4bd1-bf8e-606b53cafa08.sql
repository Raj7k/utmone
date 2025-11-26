-- Add super admin role for myselfrajnishkumar@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('cc77d27b-f1d6-4f87-8ed1-290fb4a950ff', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;