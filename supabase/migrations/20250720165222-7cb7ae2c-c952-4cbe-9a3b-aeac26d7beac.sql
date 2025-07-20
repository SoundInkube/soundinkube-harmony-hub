-- CRITICAL SECURITY FIX: Prevent privilege escalation through profile updates
-- Create secure profile update function that validates field restrictions

CREATE OR REPLACE FUNCTION public.secure_profile_update(
  target_user_id uuid,
  update_data jsonb
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid;
  current_user_type text;
  is_admin_user boolean;
  restricted_fields text[] := ARRAY['user_type', 'verified'];
  field_name text;
BEGIN
  -- Get current user info
  current_user_id := auth.uid();
  
  -- Check if user is trying to update their own profile
  IF target_user_id != current_user_id THEN
    -- Only admins can update other users' profiles
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Access denied: You can only update your own profile';
    END IF;
  END IF;
  
  -- Check if user is admin for restricted field updates
  is_admin_user := public.is_admin();
  
  -- Validate that non-admin users cannot modify restricted fields
  IF NOT is_admin_user THEN
    FOREACH field_name IN ARRAY restricted_fields LOOP
      IF update_data ? field_name THEN
        RAISE EXCEPTION 'Access denied: Cannot modify field "%"', field_name;
      END IF;
    END LOOP;
  END IF;
  
  -- Get current user type for audit logging
  SELECT user_type INTO current_user_type 
  FROM public.profiles 
  WHERE user_id = current_user_id;
  
  -- Log profile update attempt
  PERFORM public.log_admin_action(
    'profile_update',
    target_user_id,
    jsonb_build_object(
      'updated_by', current_user_id,
      'updater_type', current_user_type,
      'updated_fields', update_data,
      'is_self_update', target_user_id = current_user_id
    )
  );
  
  RETURN true;
END;
$$;

-- Create trigger function to validate profile updates
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Allow system operations (like initial profile creation)
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Check if restricted fields are being modified
  IF OLD.user_type != NEW.user_type OR OLD.verified != NEW.verified THEN
    -- Only admins can modify these fields
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Access denied: Only administrators can modify user type or verification status';
    END IF;
    
    -- Log the change
    PERFORM public.log_admin_action(
      'profile_restricted_field_update',
      NEW.user_id,
      jsonb_build_object(
        'old_user_type', OLD.user_type,
        'new_user_type', NEW.user_type,
        'old_verified', OLD.verified,
        'new_verified', NEW.verified
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to profiles table to validate updates
DROP TRIGGER IF EXISTS validate_profile_update_trigger ON public.profiles;
CREATE TRIGGER validate_profile_update_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_update();

-- Update RLS policy for profile updates to be more restrictive
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR public.is_admin()
  );

-- Add policy to prevent unauthorized profile creation
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND user_type = 'client'  -- Default user type for new users
    AND verified = false      -- New users start unverified
  );

-- Create function to safely update user profiles (for frontend use)
CREATE OR REPLACE FUNCTION public.update_user_profile(
  profile_updates jsonb
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid;
  restricted_fields text[] := ARRAY['user_type', 'verified', 'user_id', 'id'];
  field_name text;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Remove restricted fields from updates for non-admin users
  IF NOT public.is_admin() THEN
    FOREACH field_name IN ARRAY restricted_fields LOOP
      profile_updates := profile_updates - field_name;
    END LOOP;
  END IF;
  
  -- Perform the update
  EXECUTE format('UPDATE public.profiles SET %s WHERE user_id = $1',
    (SELECT string_agg(quote_ident(key) || ' = ' || quote_literal(value), ', ')
     FROM jsonb_each_text(profile_updates)))
  USING current_user_id;
  
  RETURN true;
END;
$$;