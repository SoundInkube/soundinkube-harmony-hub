-- First, let's fix Karandeep's profile to be a music professional
UPDATE profiles 
SET user_type = 'artist', 
    full_name = 'Karandeep Sodhi',
    bio = 'Music Professional'
WHERE user_id = '7af722ee-9baf-4b47-a60e-7c901cc180d0';

-- Create the missing artist record for this user since they're now an artist
INSERT INTO artists (
  profile_id, 
  stage_name, 
  experience_years, 
  rating, 
  total_reviews
) 
SELECT 
  id as profile_id,
  full_name as stage_name,
  1 as experience_years,
  0 as rating,
  0 as total_reviews
FROM profiles 
WHERE user_id = '7af722ee-9baf-4b47-a60e-7c901cc180d0'
AND NOT EXISTS (
  SELECT 1 FROM artists WHERE profile_id = profiles.id
);