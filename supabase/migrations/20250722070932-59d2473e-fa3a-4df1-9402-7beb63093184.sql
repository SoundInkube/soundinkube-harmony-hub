-- First, let's fix the existing user's profile
UPDATE public.profiles 
SET user_type = 'school', 
    full_name = 'Karandeep Sodhi'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'karandeepsodhi22@gmail.com');

-- Now let's fix the handle_new_user function to properly handle user_type from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username, user_type)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'user_type', 'client')
  );
  RETURN new;
END;
$function$;