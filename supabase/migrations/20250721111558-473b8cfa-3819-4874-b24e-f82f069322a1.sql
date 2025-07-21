-- Create storage buckets for profile images and galleries
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('avatars', 'avatars', true),
  ('profile-galleries', 'profile-galleries', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for gallery uploads
CREATE POLICY "Gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-galleries');

CREATE POLICY "Users can upload to their own gallery" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-galleries' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-galleries' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-galleries' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add gallery_images column to profiles table for storing image URLs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}';

-- Update existing profile records to have empty gallery arrays if null
UPDATE public.profiles 
SET gallery_images = '{}' 
WHERE gallery_images IS NULL;