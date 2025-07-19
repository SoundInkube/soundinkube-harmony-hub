-- Promote specific user to admin
UPDATE public.profiles 
SET user_type = 'admin', 
    verified = true,
    full_name = COALESCE(full_name, 'Platform Administrator'),
    bio = 'Platform administrator with full system access'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
);