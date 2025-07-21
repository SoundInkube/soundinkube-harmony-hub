-- Create function to auto-create artist record when user type changes to artist
CREATE OR REPLACE FUNCTION public.handle_artist_profile_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- If user_type changed to 'artist' and no artist record exists
  IF NEW.user_type = 'artist' AND (OLD.user_type IS NULL OR OLD.user_type != 'artist') THEN
    -- Check if artist record doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM public.artists WHERE profile_id = NEW.id) THEN
      -- Create artist record
      INSERT INTO public.artists (
        profile_id,
        stage_name,
        genres,
        instruments,
        hourly_rate,
        availability_status,
        rating,
        total_reviews,
        experience_years
      ) VALUES (
        NEW.id,
        COALESCE(NEW.full_name, NEW.username, 'Artist'),
        COALESCE(NEW.genres, '{}'),
        COALESCE(NEW.instruments, '{}'),
        NEW.hourly_rate,
        NEW.availability_status,
        0,
        0,
        CASE 
          WHEN NEW.experience_level = 'beginner' THEN 1
          WHEN NEW.experience_level = 'intermediate' THEN 3
          WHEN NEW.experience_level = 'advanced' THEN 5
          WHEN NEW.experience_level = 'expert' THEN 10
          ELSE 0
        END
      );
    END IF;
  END IF;
  
  -- If user_type changed from 'artist' to something else, remove artist record
  IF OLD.user_type = 'artist' AND NEW.user_type != 'artist' THEN
    DELETE FROM public.artists WHERE profile_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for automatic artist record creation/deletion
CREATE TRIGGER handle_artist_profile_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_artist_profile_creation();

-- Create artist record for existing artist profiles
INSERT INTO public.artists (
  profile_id,
  stage_name,
  genres,
  instruments,
  hourly_rate,
  availability_status,
  rating,
  total_reviews,
  experience_years
)
SELECT 
  p.id,
  COALESCE(p.full_name, p.username, 'Artist'),
  COALESCE(p.genres, '{}'),
  COALESCE(p.instruments, '{}'),
  p.hourly_rate,
  p.availability_status,
  0,
  0,
  CASE 
    WHEN p.experience_level = 'beginner' THEN 1
    WHEN p.experience_level = 'intermediate' THEN 3
    WHEN p.experience_level = 'advanced' THEN 5
    WHEN p.experience_level = 'expert' THEN 10
    ELSE 0
  END
FROM public.profiles p
WHERE p.user_type = 'artist' 
AND NOT EXISTS (SELECT 1 FROM public.artists a WHERE a.profile_id = p.id);