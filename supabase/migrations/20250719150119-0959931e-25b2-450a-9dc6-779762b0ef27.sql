-- CRITICAL SECURITY FIXES
-- Phase 1: Fix Database Functions Security

-- 1. Fix handle_new_user function - Add proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$function$;

-- 2. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Fix promote_first_user_to_admin function - Add proper search_path
CREATE OR REPLACE FUNCTION public.promote_first_user_to_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- 4. Create secure admin validation function
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = user_uuid 
    AND user_type = 'admin' 
    AND verified = true
  );
$$;

-- 5. Replace the insecure promote_user_to_admin function with admin-only version
CREATE OR REPLACE FUNCTION public.promote_user_to_admin(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- CRITICAL FIX: Only allow existing admins to promote users
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can promote users';
  END IF;

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
$function$;

-- 6. Create admin audit logging table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_log 
FOR SELECT 
USING (public.is_admin());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.admin_audit_log 
FOR INSERT 
WITH CHECK (true);

-- 7. Create audit logging function
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_name text,
  target_user_uuid uuid DEFAULT NULL,
  action_details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only log if the current user is an admin
  IF public.is_admin() THEN
    INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, details)
    VALUES (auth.uid(), action_name, target_user_uuid, action_details);
  END IF;
END;
$function$;

-- 8. Enhanced user management function with audit logging
CREATE OR REPLACE FUNCTION public.admin_update_user_type(
  target_user_id uuid,
  new_user_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  old_user_type text;
BEGIN
  -- CRITICAL: Only admins can update user types
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can update user types';
  END IF;

  -- Get current user type for audit log
  SELECT user_type INTO old_user_type 
  FROM public.profiles 
  WHERE user_id = target_user_id;

  -- Update user type
  UPDATE public.profiles 
  SET user_type = new_user_type
  WHERE user_id = target_user_id;

  -- Log the action
  PERFORM public.log_admin_action(
    'user_type_update',
    target_user_id,
    jsonb_build_object(
      'old_type', old_user_type,
      'new_type', new_user_type
    )
  );

  RETURN FOUND;
END;
$function$;

-- 9. Enhanced user verification function with audit logging
CREATE OR REPLACE FUNCTION public.admin_update_user_verification(
  target_user_id uuid,
  is_verified boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  old_verified boolean;
BEGIN
  -- CRITICAL: Only admins can update verification status
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can update verification status';
  END IF;

  -- Get current verification status for audit log
  SELECT verified INTO old_verified 
  FROM public.profiles 
  WHERE user_id = target_user_id;

  -- Update verification status
  UPDATE public.profiles 
  SET verified = is_verified
  WHERE user_id = target_user_id;

  -- Log the action
  PERFORM public.log_admin_action(
    'verification_update',
    target_user_id,
    jsonb_build_object(
      'old_verified', old_verified,
      'new_verified', is_verified
    )
  );

  RETURN FOUND;
END;
$function$;

-- 10. Secure user deletion function
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  user_profile record;
BEGIN
  -- CRITICAL: Only admins can delete users
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Only administrators can delete users';
  END IF;

  -- Prevent admins from deleting themselves
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  -- Get user profile for audit log
  SELECT * INTO user_profile 
  FROM public.profiles 
  WHERE user_id = target_user_id;

  -- Prevent deletion of other admins (safety measure)
  IF user_profile.user_type = 'admin' THEN
    RAISE EXCEPTION 'Cannot delete other administrator accounts';
  END IF;

  -- Log the action before deletion
  PERFORM public.log_admin_action(
    'user_deletion',
    target_user_id,
    jsonb_build_object(
      'deleted_user_type', user_profile.user_type,
      'deleted_user_name', user_profile.full_name
    )
  );

  -- Delete from profiles (auth.users will be cascade deleted by auth system)
  DELETE FROM public.profiles WHERE user_id = target_user_id;

  RETURN FOUND;
END;
$function$;