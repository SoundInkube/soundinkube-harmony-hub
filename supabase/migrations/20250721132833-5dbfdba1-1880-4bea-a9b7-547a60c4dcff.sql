-- Fix Karandeep's profile to be a music professional
UPDATE profiles 
SET user_type = 'artist', 
    full_name = 'Karandeep Sodhi',
    bio = 'Music Professional'
WHERE user_id = '7af722ee-9baf-4b47-a60e-7c901cc180d0';

-- This will trigger the function to create the artist record automatically