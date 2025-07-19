-- Create a function to automatically promote the first user to admin
CREATE OR REPLACE FUNCTION public.promote_first_user_to_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the first user (no other profiles exist)
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_type = 'admin') THEN
    NEW.user_type = 'admin';
    NEW.verified = true;
    NEW.full_name = COALESCE(NEW.full_name, 'Platform Administrator');
    NEW.bio = 'Platform administrator with full system access';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to promote first user to admin
DROP TRIGGER IF EXISTS promote_first_user_trigger ON public.profiles;
CREATE TRIGGER promote_first_user_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.promote_first_user_to_admin();

-- Alternative: Create a specific admin account for a predetermined email
-- You can also manually promote any user by email with this function
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET user_type = 'admin', 
      verified = true,
      full_name = COALESCE(full_name, 'Platform Administrator'),
      bio = 'Platform administrator with full system access'
  WHERE user_id = (
    SELECT id FROM auth.users WHERE email = user_email
  );
  
  RETURN FOUND;
END;
$$;