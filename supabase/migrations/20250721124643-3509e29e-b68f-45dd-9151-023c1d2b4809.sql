-- Create genres table with comprehensive music genres
CREATE TABLE public.genres (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on genres table
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read genres
CREATE POLICY "Anyone can view genres" 
ON public.genres 
FOR SELECT 
USING (true);

-- Insert comprehensive list of music genres
INSERT INTO public.genres (name, category, description) VALUES
-- Popular/Mainstream
('Pop', 'Popular', 'Popular music with catchy melodies and mainstream appeal'),
('Rock', 'Popular', 'Guitar-driven music with strong rhythms'),
('Hip Hop', 'Popular', 'Rhythmic spoken lyrics over beats'),
('R&B', 'Popular', 'Rhythm and Blues with soulful vocals'),
('Electronic', 'Popular', 'Music produced primarily with electronic instruments'),
('Dance', 'Popular', 'Upbeat music designed for dancing'),
('Country', 'Popular', 'American folk music with storytelling'),
('Reggae', 'Popular', 'Jamaican music with distinctive rhythm'),

-- Indian Classical & Traditional
('Hindustani Classical', 'Indian Classical', 'North Indian classical music tradition'),
('Carnatic Classical', 'Indian Classical', 'South Indian classical music tradition'),
('Indian Folk', 'Indian Traditional', 'Traditional folk music from various Indian regions'),
('Bhajan', 'Indian Traditional', 'Devotional songs in Indian traditions'),
('Qawwali', 'Indian Traditional', 'Sufi devotional music'),
('Ghazal', 'Indian Traditional', 'Poetic form of music expressing love and loss'),

-- Bollywood & Film
('Bollywood', 'Film Music', 'Music from Hindi cinema'),
('Tollywood', 'Film Music', 'Music from Telugu cinema'),
('Kollywood', 'Film Music', 'Music from Tamil cinema'),
('Regional Film Music', 'Film Music', 'Music from regional Indian cinema'),

-- Jazz & Blues
('Jazz', 'Jazz', 'Complex harmonies and improvisation'),
('Blues', 'Jazz', 'Twelve-bar musical form with blue notes'),
('Swing', 'Jazz', 'Jazz subgenre with strong rhythm section'),
('Bebop', 'Jazz', 'Complex jazz with fast tempos'),

-- Classical Western
('Classical', 'Western Classical', 'Traditional Western art music'),
('Baroque', 'Western Classical', 'Ornate classical music (1600-1750)'),
('Romantic', 'Western Classical', 'Expressive classical music (1800-1910)'),
('Contemporary Classical', 'Western Classical', 'Modern classical compositions'),

-- World Music
('World Music', 'World', 'Traditional music from various cultures'),
('Celtic', 'World', 'Traditional music from Celtic regions'),
('Latin', 'World', 'Music from Latin American countries'),
('African', 'World', 'Traditional African music'),
('Middle Eastern', 'World', 'Music from Middle Eastern regions'),

-- Rock Subgenres
('Alternative Rock', 'Rock', 'Non-mainstream rock music'),
('Hard Rock', 'Rock', 'Aggressive form of rock music'),
('Metal', 'Rock', 'Heavy, aggressive rock music'),
('Punk', 'Rock', 'Fast, raw rock music'),
('Indie Rock', 'Rock', 'Independent rock music'),

-- Electronic Subgenres
('House', 'Electronic', 'Repetitive 4/4 beats with synthesized basslines'),
('Techno', 'Electronic', 'Repetitive electronic music for dancing'),
('Ambient', 'Electronic', 'Atmospheric electronic music'),
('Dubstep', 'Electronic', 'Electronic music with syncopated drum patterns'),
('Trance', 'Electronic', 'Hypnotic electronic music'),

-- Fusion & Contemporary
('Fusion', 'Fusion', 'Blend of different musical styles'),
('Indo-Western Fusion', 'Fusion', 'Blend of Indian and Western music'),
('Jazz Fusion', 'Fusion', 'Jazz combined with rock, funk, and R&B'),
('World Fusion', 'Fusion', 'Fusion of world music traditions'),

-- Specialty
('Instrumental', 'Specialty', 'Music without vocals'),
('Acoustic', 'Specialty', 'Music performed with acoustic instruments'),
('Live Performance', 'Specialty', 'Music optimized for live performances'),
('Studio Recording', 'Specialty', 'Music optimized for studio production'),
('Background Music', 'Specialty', 'Music designed for ambient listening'),
('Devotional', 'Specialty', 'Religious or spiritual music'),
('Children''s Music', 'Specialty', 'Music designed for children'),
('Educational', 'Specialty', 'Music for teaching and learning');

-- Add genre relationships tables for many-to-many relationships
CREATE TABLE public.profile_genres (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(profile_id, genre_id)
);

CREATE TABLE public.gig_genres (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gig_id uuid NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(gig_id, genre_id)
);

CREATE TABLE public.collaboration_genres (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaboration_id uuid NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
  genre_id uuid NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(collaboration_id, genre_id)
);

-- Enable RLS on junction tables
ALTER TABLE public.profile_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_genres ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile_genres
CREATE POLICY "Users can view profile genres" 
ON public.profile_genres 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own profile genres" 
ON public.profile_genres 
FOR ALL 
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS policies for gig_genres  
CREATE POLICY "Anyone can view gig genres" 
ON public.gig_genres 
FOR SELECT 
USING (true);

CREATE POLICY "Gig owners can manage gig genres" 
ON public.gig_genres 
FOR ALL 
USING (gig_id IN (SELECT id FROM gigs WHERE client_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

-- RLS policies for collaboration_genres
CREATE POLICY "Anyone can view collaboration genres" 
ON public.collaboration_genres 
FOR SELECT 
USING (true);

CREATE POLICY "Collaboration owners can manage collaboration genres" 
ON public.collaboration_genres 
FOR ALL 
USING (collaboration_id IN (SELECT id FROM collaborations WHERE creator_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

-- Create indexes for better performance
CREATE INDEX idx_profile_genres_profile_id ON public.profile_genres(profile_id);
CREATE INDEX idx_profile_genres_genre_id ON public.profile_genres(genre_id);
CREATE INDEX idx_gig_genres_gig_id ON public.gig_genres(gig_id);
CREATE INDEX idx_gig_genres_genre_id ON public.gig_genres(genre_id);
CREATE INDEX idx_collaboration_genres_collaboration_id ON public.collaboration_genres(collaboration_id);
CREATE INDEX idx_collaboration_genres_genre_id ON public.collaboration_genres(genre_id);
CREATE INDEX idx_genres_category ON public.genres(category);

-- Create function to get profile genres
CREATE OR REPLACE FUNCTION public.get_profile_genres(profile_uuid uuid)
RETURNS TABLE(genre_name text, genre_category text)
LANGUAGE sql
STABLE
AS $$
  SELECT g.name, g.category
  FROM public.genres g
  INNER JOIN public.profile_genres pg ON pg.genre_id = g.id
  WHERE pg.profile_id = profile_uuid
  ORDER BY g.category, g.name;
$$;

-- Create function to get gig genres  
CREATE OR REPLACE FUNCTION public.get_gig_genres(gig_uuid uuid)
RETURNS TABLE(genre_name text, genre_category text)
LANGUAGE sql
STABLE
AS $$
  SELECT g.name, g.category
  FROM public.genres g
  INNER JOIN public.gig_genres gg ON gg.genre_id = g.id
  WHERE gg.gig_id = gig_uuid
  ORDER BY g.category, g.name;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_genres_updated_at
  BEFORE UPDATE ON public.genres
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();