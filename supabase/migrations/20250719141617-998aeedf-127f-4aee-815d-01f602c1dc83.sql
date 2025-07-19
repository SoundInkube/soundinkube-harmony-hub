-- Add admin user type to the existing constraint
ALTER TABLE profiles DROP CONSTRAINT profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type = ANY (ARRAY['artist'::text, 'client'::text, 'studio'::text, 'school'::text, 'label'::text, 'manager'::text, 'admin'::text]));