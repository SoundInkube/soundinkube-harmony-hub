-- Update specialization to be an array field
ALTER TABLE public.artists 
DROP COLUMN IF EXISTS specialization;

ALTER TABLE public.artists 
ADD COLUMN specializations text[] DEFAULT '{}';

ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS specialization;

ALTER TABLE public.profiles 
ADD COLUMN specializations text[] DEFAULT '{}';