-- Delete all user data except admin
-- First delete all related data for non-admin users
DELETE FROM public.artists WHERE profile_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.studios WHERE profile_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.music_schools WHERE profile_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.record_labels WHERE profile_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.bookings WHERE client_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
) AND provider_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.gigs WHERE client_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.collaborations WHERE creator_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.marketplace WHERE seller_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.messages WHERE sender_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
) AND recipient_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

DELETE FROM public.reviews WHERE reviewer_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
) AND reviewee_id NOT IN (
  SELECT id FROM public.profiles WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
  )
);

-- Delete all profiles except admin
DELETE FROM public.profiles WHERE user_id != (
  SELECT id FROM auth.users WHERE email = 'soundvibetribe@gmail.com'
);

-- Note: auth.users deletion would need to be done through Supabase auth admin API
-- The profiles deletion will cascade to remove most related data