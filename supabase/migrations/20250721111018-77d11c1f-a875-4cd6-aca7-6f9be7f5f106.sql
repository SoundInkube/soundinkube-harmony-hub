-- Create function to auto-create studio record when user type changes to studio
CREATE OR REPLACE FUNCTION public.handle_studio_profile_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- If user_type changed to 'studio' and no studio record exists
  IF NEW.user_type = 'studio' AND (OLD.user_type IS NULL OR OLD.user_type != 'studio') THEN
    -- Check if studio record doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM public.studios WHERE profile_id = NEW.id) THEN
      -- Create studio record
      INSERT INTO public.studios (
        profile_id,
        studio_name,
        description,
        hourly_rate,
        specialties,
        equipment,
        amenities,
        address,
        city,
        state,
        postal_code,
        rating,
        total_reviews
      ) VALUES (
        NEW.id,
        COALESCE(NEW.company_name, NEW.full_name, NEW.username, 'Studio'),
        NEW.bio,
        NEW.hourly_rate,
        COALESCE(NEW.genres, '{}'),
        COALESCE(NEW.skills, '{}'),
        '{}',
        NEW.location,
        SPLIT_PART(NEW.location, ',', 1),
        SPLIT_PART(NEW.location, ',', 2),
        NULL,
        0,
        0
      );
    END IF;
  END IF;
  
  -- If user_type changed from 'studio' to something else, remove studio record
  IF OLD.user_type = 'studio' AND NEW.user_type != 'studio' THEN
    DELETE FROM public.studios WHERE profile_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create function to auto-create music school record when user type changes to school
CREATE OR REPLACE FUNCTION public.handle_school_profile_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- If user_type changed to 'school' and no school record exists
  IF NEW.user_type = 'school' AND (OLD.user_type IS NULL OR OLD.user_type != 'school') THEN
    -- Check if school record doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM public.music_schools WHERE profile_id = NEW.id) THEN
      -- Create music school record
      INSERT INTO public.music_schools (
        profile_id,
        school_name,
        description,
        founded_year,
        monthly_fee,
        instruments_taught,
        courses_offered,
        facilities,
        address,
        city,
        state,
        postal_code,
        rating,
        total_reviews
      ) VALUES (
        NEW.id,
        COALESCE(NEW.company_name, NEW.full_name, NEW.username, 'Music School'),
        NEW.bio,
        NEW.founded_year,
        NEW.hourly_rate, -- Using hourly_rate as monthly_fee placeholder
        COALESCE(NEW.instruments, '{}'),
        COALESCE(NEW.skills, '{}'),
        '{}',
        NEW.location,
        SPLIT_PART(NEW.location, ',', 1),
        SPLIT_PART(NEW.location, ',', 2),
        NULL,
        0,
        0
      );
    END IF;
  END IF;
  
  -- If user_type changed from 'school' to something else, remove school record
  IF OLD.user_type = 'school' AND NEW.user_type != 'school' THEN
    DELETE FROM public.music_schools WHERE profile_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create function to auto-create record label record when user type changes to label
CREATE OR REPLACE FUNCTION public.handle_label_profile_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- If user_type changed to 'label' and no label record exists
  IF NEW.user_type = 'label' AND (OLD.user_type IS NULL OR OLD.user_type != 'label') THEN
    -- Check if label record doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM public.record_labels WHERE profile_id = NEW.id) THEN
      -- Create record label record
      INSERT INTO public.record_labels (
        profile_id,
        label_name,
        description,
        founded_year,
        genres,
        artists_signed,
        contact_email,
        website,
        address,
        city,
        state,
        postal_code,
        rating,
        total_reviews
      ) VALUES (
        NEW.id,
        COALESCE(NEW.company_name, NEW.full_name, NEW.username, 'Record Label'),
        NEW.bio,
        NEW.founded_year,
        COALESCE(NEW.genres, '{}'),
        0,
        NULL, -- Will need to be set manually
        NEW.website,
        NEW.location,
        SPLIT_PART(NEW.location, ',', 1),
        SPLIT_PART(NEW.location, ',', 2),
        NULL,
        0,
        0
      );
    END IF;
  END IF;
  
  -- If user_type changed from 'label' to something else, remove label record
  IF OLD.user_type = 'label' AND NEW.user_type != 'label' THEN
    DELETE FROM public.record_labels WHERE profile_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update the existing artist trigger to be part of a comprehensive profile handler
CREATE OR REPLACE FUNCTION public.handle_comprehensive_profile_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Handle artist profiles
  IF NEW.user_type = 'artist' AND (OLD.user_type IS NULL OR OLD.user_type != 'artist') THEN
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE profile_id = NEW.id) THEN
      INSERT INTO public.artists (
        profile_id, stage_name, genres, instruments, hourly_rate,
        availability_status, rating, total_reviews, experience_years
      ) VALUES (
        NEW.id,
        COALESCE(NEW.full_name, NEW.username, 'Artist'),
        COALESCE(NEW.genres, '{}'),
        COALESCE(NEW.instruments, '{}'),
        NEW.hourly_rate,
        NEW.availability_status,
        0, 0,
        CASE 
          WHEN NEW.experience_level = 'beginner' THEN 1
          WHEN NEW.experience_level = 'intermediate' THEN 3
          WHEN NEW.experience_level = 'advanced' THEN 5
          WHEN NEW.experience_level = 'expert' THEN 10
          ELSE 0
        END
      );
    END IF;
  ELSIF OLD.user_type = 'artist' AND NEW.user_type != 'artist' THEN
    DELETE FROM public.artists WHERE profile_id = NEW.id;
  END IF;

  -- Handle studio profiles
  IF NEW.user_type = 'studio' AND (OLD.user_type IS NULL OR OLD.user_type != 'studio') THEN
    IF NOT EXISTS (SELECT 1 FROM public.studios WHERE profile_id = NEW.id) THEN
      INSERT INTO public.studios (
        profile_id, studio_name, description, hourly_rate, specialties, 
        equipment, amenities, address, city, state, rating, total_reviews
      ) VALUES (
        NEW.id,
        COALESCE(NEW.company_name, NEW.full_name, NEW.username, 'Studio'),
        NEW.bio, NEW.hourly_rate, COALESCE(NEW.genres, '{}'),
        COALESCE(NEW.skills, '{}'), '{}', NEW.location,
        SPLIT_PART(COALESCE(NEW.location, ''), ',', 1),
        SPLIT_PART(COALESCE(NEW.location, ''), ',', 2),
        0, 0
      );
    END IF;
  ELSIF OLD.user_type = 'studio' AND NEW.user_type != 'studio' THEN
    DELETE FROM public.studios WHERE profile_id = NEW.id;
  END IF;

  -- Handle school profiles
  IF NEW.user_type = 'school' AND (OLD.user_type IS NULL OR OLD.user_type != 'school') THEN
    IF NOT EXISTS (SELECT 1 FROM public.music_schools WHERE profile_id = NEW.id) THEN
      INSERT INTO public.music_schools (
        profile_id, school_name, description, founded_year, monthly_fee,
        instruments_taught, courses_offered, facilities, address, city, 
        state, rating, total_reviews
      ) VALUES (
        NEW.id,
        COALESCE(NEW.company_name, NEW.full_name, NEW.username, 'Music School'),
        NEW.bio, NEW.founded_year, NEW.hourly_rate,
        COALESCE(NEW.instruments, '{}'), COALESCE(NEW.skills, '{}'), '{}',
        NEW.location, SPLIT_PART(COALESCE(NEW.location, ''), ',', 1),
        SPLIT_PART(COALESCE(NEW.location, ''), ',', 2), 0, 0
      );
    END IF;
  ELSIF OLD.user_type = 'school' AND NEW.user_type != 'school' THEN
    DELETE FROM public.music_schools WHERE profile_id = NEW.id;
  END IF;

  -- Handle label profiles
  IF NEW.user_type = 'label' AND (OLD.user_type IS NULL OR OLD.user_type != 'label') THEN
    IF NOT EXISTS (SELECT 1 FROM public.record_labels WHERE profile_id = NEW.id) THEN
      INSERT INTO public.record_labels (
        profile_id, label_name, description, founded_year, genres,
        artists_signed, website, address, city, state, rating, total_reviews
      ) VALUES (
        NEW.id,
        COALESCE(NEW.company_name, NEW.full_name, NEW.username, 'Record Label'),
        NEW.bio, NEW.founded_year, COALESCE(NEW.genres, '{}'),
        0, NEW.website, NEW.location,
        SPLIT_PART(COALESCE(NEW.location, ''), ',', 1),
        SPLIT_PART(COALESCE(NEW.location, ''), ',', 2), 0, 0
      );
    END IF;
  ELSIF OLD.user_type = 'label' AND NEW.user_type != 'label' THEN
    DELETE FROM public.record_labels WHERE profile_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Drop old trigger and create new comprehensive one
DROP TRIGGER IF EXISTS handle_artist_profile_trigger ON public.profiles;
CREATE TRIGGER handle_all_profile_types_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_comprehensive_profile_creation();

-- Create records for existing profiles of all types
INSERT INTO public.studios (
  profile_id, studio_name, description, hourly_rate, specialties, 
  equipment, amenities, address, city, state, rating, total_reviews
)
SELECT 
  p.id,
  COALESCE(p.company_name, p.full_name, p.username, 'Studio'),
  p.bio, p.hourly_rate, COALESCE(p.genres, '{}'),
  COALESCE(p.skills, '{}'), '{}', p.location,
  SPLIT_PART(COALESCE(p.location, ''), ',', 1),
  SPLIT_PART(COALESCE(p.location, ''), ',', 2), 0, 0
FROM public.profiles p
WHERE p.user_type = 'studio' 
AND NOT EXISTS (SELECT 1 FROM public.studios s WHERE s.profile_id = p.id);

INSERT INTO public.music_schools (
  profile_id, school_name, description, founded_year, monthly_fee,
  instruments_taught, courses_offered, facilities, address, city, 
  state, rating, total_reviews
)
SELECT 
  p.id,
  COALESCE(p.company_name, p.full_name, p.username, 'Music School'),
  p.bio, p.founded_year, p.hourly_rate,
  COALESCE(p.instruments, '{}'), COALESCE(p.skills, '{}'), '{}',
  p.location, SPLIT_PART(COALESCE(p.location, ''), ',', 1),
  SPLIT_PART(COALESCE(p.location, ''), ',', 2), 0, 0
FROM public.profiles p
WHERE p.user_type = 'school' 
AND NOT EXISTS (SELECT 1 FROM public.music_schools ms WHERE ms.profile_id = p.id);

INSERT INTO public.record_labels (
  profile_id, label_name, description, founded_year, genres,
  artists_signed, website, address, city, state, rating, total_reviews
)
SELECT 
  p.id,
  COALESCE(p.company_name, p.full_name, p.username, 'Record Label'),
  p.bio, p.founded_year, COALESCE(p.genres, '{}'),
  0, p.website, p.location,
  SPLIT_PART(COALESCE(p.location, ''), ',', 1),
  SPLIT_PART(COALESCE(p.location, ''), ',', 2), 0, 0
FROM public.profiles p
WHERE p.user_type = 'label' 
AND NOT EXISTS (SELECT 1 FROM public.record_labels rl WHERE rl.profile_id = p.id);