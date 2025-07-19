-- Add admin user type to the existing constraint
ALTER TABLE profiles DROP CONSTRAINT profiles_user_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type = ANY (ARRAY['artist'::text, 'client'::text, 'studio'::text, 'school'::text, 'label'::text, 'manager'::text, 'admin'::text]));

-- Create admin user profile
INSERT INTO profiles (id, user_id, full_name, username, user_type, bio, verified) VALUES
('admin-profile-id-123', 'admin-user-id-123', 'System Administrator', 'admin', 'admin', 'Platform administrator with full system access', true)
ON CONFLICT (user_id) DO UPDATE SET
  user_type = 'admin',
  full_name = 'System Administrator',
  username = 'admin',
  bio = 'Platform administrator with full system access',
  verified = true;