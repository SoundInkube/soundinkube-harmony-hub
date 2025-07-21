-- Fix search_path security issues in database functions
CREATE OR REPLACE FUNCTION public.get_profile_genres(profile_uuid uuid)
 RETURNS TABLE(genre_name text, genre_category text)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT g.name, g.category
  FROM public.genres g
  INNER JOIN public.profile_genres pg ON pg.genre_id = g.id
  WHERE pg.profile_id = profile_uuid
  ORDER BY g.category, g.name;
$function$;

CREATE OR REPLACE FUNCTION public.get_gig_genres(gig_uuid uuid)
 RETURNS TABLE(genre_name text, genre_category text)
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT g.name, g.category
  FROM public.genres g
  INNER JOIN public.gig_genres gg ON gg.genre_id = g.id
  WHERE gg.gig_id = gig_uuid
  ORDER BY g.category, g.name;
$function$;