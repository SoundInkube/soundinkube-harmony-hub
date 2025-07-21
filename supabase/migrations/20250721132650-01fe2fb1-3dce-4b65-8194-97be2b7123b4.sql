-- First, let's fix the function that has the wrong column reference
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
        availability_status, rating, total_reviews, experience_years, specializations
      ) VALUES (
        NEW.id,
        COALESCE(NEW.full_name, NEW.username, 'Music Professional'),
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
        END,
        COALESCE(NEW.specializations, '{}')
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