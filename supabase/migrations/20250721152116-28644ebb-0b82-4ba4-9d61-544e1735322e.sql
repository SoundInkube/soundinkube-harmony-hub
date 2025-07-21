-- Add more comprehensive music genres that are missing

INSERT INTO public.genres (name, category, description) VALUES
-- Metal Subgenres
('Heavy Metal', 'Rock', 'Classic heavy metal music'),
('Death Metal', 'Rock', 'Extreme metal with growling vocals'),
('Black Metal', 'Rock', 'Extreme metal with blast beats and screeching vocals'),
('Thrash Metal', 'Rock', 'Fast, aggressive metal'),
('Power Metal', 'Rock', 'Melodic metal with fantasy themes'),
('Progressive Metal', 'Rock', 'Complex metal with unusual time signatures'),
('Doom Metal', 'Rock', 'Slow, heavy metal'),
('Nu Metal', 'Rock', 'Metal fusion with hip hop and alternative rock'),

-- More Indian Genres
('Punjabi Pop', 'Indian Popular', 'Popular music from Punjab'),
('Bengali Music', 'Indian Traditional', 'Traditional and modern Bengali music'),
('Marathi Music', 'Indian Traditional', 'Traditional and modern Marathi music'),
('Gujarati Music', 'Indian Traditional', 'Traditional and modern Gujarati music'),
('Tamil Music', 'Indian Traditional', 'Traditional and modern Tamil music'),
('Telugu Music', 'Indian Traditional', 'Traditional and modern Telugu music'),
('Malayalam Music', 'Indian Traditional', 'Traditional and modern Malayalam music'),
('Kannada Music', 'Indian Traditional', 'Traditional and modern Kannada music'),
('Assamese Music', 'Indian Traditional', 'Traditional music from Assam'),
('Rajasthani Folk', 'Indian Traditional', 'Traditional folk music from Rajasthan'),
('Punjabi Folk', 'Indian Traditional', 'Traditional folk music from Punjab'),

-- More Bollywood and Film Music
('Item Songs', 'Film Music', 'Dance numbers from Bollywood films'),
('Playback Singing', 'Film Music', 'Pre-recorded songs for films'),
('Background Score', 'Film Music', 'Instrumental music for films'),

-- Electronic Subgenres
('EDM', 'Electronic', 'Electronic Dance Music'),
('Trap', 'Electronic', 'Electronic music with hip hop influences'),
('Drum and Bass', 'Electronic', 'Fast electronic music with heavy bass'),
('Breakbeat', 'Electronic', 'Electronic music with syncopated drum patterns'),
('Chillout', 'Electronic', 'Relaxed electronic music'),
('Downtempo', 'Electronic', 'Slow-tempo electronic music'),

-- More Popular Genres
('Indie Pop', 'Popular', 'Independent pop music'),
('Synthpop', 'Popular', 'Pop music with synthesizers'),
('Folk Rock', 'Popular', 'Combination of folk and rock'),
('Soft Rock', 'Popular', 'Mellow rock music'),
('Classic Rock', 'Rock', 'Rock music from 1960s-1980s'),
('Grunge', 'Rock', 'Raw, distorted rock from Seattle'),
('Emo', 'Rock', 'Emotional rock music'),
('Post Rock', 'Rock', 'Instrumental rock with experimental elements'),

-- More Jazz Subgenres
('Smooth Jazz', 'Jazz', 'Mellow, easy-listening jazz'),
('Free Jazz', 'Jazz', 'Experimental jazz without fixed chord progressions'),
('Latin Jazz', 'Jazz', 'Jazz with Latin American rhythms'),
('Acid Jazz', 'Fusion', 'Jazz with funk, hip hop, and electronic elements'),

-- More World Music
('Flamenco', 'World', 'Traditional Spanish music and dance'),
('Bossa Nova', 'World', 'Brazilian music style'),
('Reggaeton', 'World', 'Latin urban music'),
('K-Pop', 'World', 'Korean pop music'),
('J-Pop', 'World', 'Japanese pop music'),
('Afrobeat', 'World', 'West African music genre'),
('Salsa', 'World', 'Latin dance music'),
('Tango', 'World', 'Argentine dance music'),

-- Specialty Genres
('Meditation Music', 'Specialty', 'Music for meditation and relaxation'),
('Healing Music', 'Specialty', 'Music for therapeutic purposes'),
('Workout Music', 'Specialty', 'High-energy music for exercise'),
('Gaming Music', 'Specialty', 'Music composed for video games'),
('Podcast Music', 'Specialty', 'Music for podcast intros and backgrounds'),
('Commercial Music', 'Specialty', 'Music for advertisements and commercials'),
('Wedding Music', 'Specialty', 'Music for wedding ceremonies and receptions'),

-- More Classical
('Opera', 'Western Classical', 'Classical music with vocal performances'),
('Chamber Music', 'Western Classical', 'Classical music for small ensembles'),
('Symphony', 'Western Classical', 'Large-scale orchestral compositions'),
('Concerto', 'Western Classical', 'Classical music featuring a solo instrument'),

-- Devotional and Spiritual
('Kirtan', 'Indian Traditional', 'Call-and-response chanting'),
('Aarti', 'Indian Traditional', 'Hindu devotional songs'),
('Gospel', 'Specialty', 'Christian religious music'),
('Spiritual', 'Specialty', 'Religious and spiritual music'),

-- Modern Fusion
('Electro-Folk', 'Fusion', 'Electronic music with folk elements'),
('Prog Rock', 'Rock', 'Progressive rock with complex compositions'),
('Art Rock', 'Rock', 'Experimental rock music'),
('Psychedelic Rock', 'Rock', 'Rock music with psychedelic sounds');

-- Create teacher specializations table
CREATE TABLE public.teacher_specializations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for teacher specializations
ALTER TABLE public.teacher_specializations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view teacher specializations" 
ON public.teacher_specializations 
FOR SELECT 
USING (true);

-- Insert teacher specializations
INSERT INTO public.teacher_specializations (name, category, description) VALUES
-- Instrument Teaching
('Piano Teaching', 'Instrument', 'Teaching piano and keyboard instruments'),
('Guitar Teaching', 'Instrument', 'Teaching acoustic and electric guitar'),
('Violin Teaching', 'Instrument', 'Teaching violin and string instruments'),
('Drums Teaching', 'Instrument', 'Teaching drum kit and percussion'),
('Flute Teaching', 'Instrument', 'Teaching flute and wind instruments'),
('Saxophone Teaching', 'Instrument', 'Teaching saxophone and brass instruments'),
('Bass Teaching', 'Instrument', 'Teaching bass guitar and upright bass'),
('Ukulele Teaching', 'Instrument', 'Teaching ukulele'),
('Harmonica Teaching', 'Instrument', 'Teaching harmonica'),
('Tabla Teaching', 'Instrument', 'Teaching tabla and Indian percussion'),
('Sitar Teaching', 'Instrument', 'Teaching sitar and Indian string instruments'),
('Harmonium Teaching', 'Instrument', 'Teaching harmonium'),

-- Vocal Teaching
('Vocal Coaching', 'Vocal', 'General vocal training and technique'),
('Classical Vocal', 'Vocal', 'Hindustani and Carnatic classical vocal training'),
('Western Vocal', 'Vocal', 'Western classical and contemporary vocal training'),
('Playback Singing', 'Vocal', 'Training for film playback singing'),
('Opera Singing', 'Vocal', 'Classical opera vocal training'),
('Choir Direction', 'Vocal', 'Leading and training choirs'),
('Voice Therapy', 'Vocal', 'Therapeutic vocal training'),

-- Music Theory and Composition
('Music Theory', 'Academic', 'Teaching music theory and harmony'),
('Composition', 'Academic', 'Teaching music composition and songwriting'),
('Music History', 'Academic', 'Teaching music history and appreciation'),
('Music Analysis', 'Academic', 'Teaching musical analysis and criticism'),
('Sight Reading', 'Academic', 'Teaching sight reading and notation'),
('Ear Training', 'Academic', 'Teaching aural skills and ear training'),

-- Technology and Production
('Music Production', 'Technology', 'Teaching digital audio workstations and production'),
('Audio Engineering', 'Technology', 'Teaching recording and mixing techniques'),
('Electronic Music', 'Technology', 'Teaching electronic music creation'),
('MIDI Programming', 'Technology', 'Teaching MIDI and digital instruments'),
('Home Studio Setup', 'Technology', 'Teaching home recording setup'),
('Live Sound', 'Technology', 'Teaching live sound engineering'),

-- Specialized Teaching
('Music Therapy', 'Specialized', 'Using music for therapeutic purposes'),
('Children''s Music', 'Specialized', 'Teaching music to children'),
('Adult Beginners', 'Specialized', 'Teaching music to adult beginners'),
('Special Needs', 'Specialized', 'Music education for special needs students'),
('Online Teaching', 'Specialized', 'Remote music education'),
('Group Classes', 'Specialized', 'Teaching music in group settings'),
('One-on-One', 'Specialized', 'Individual music instruction'),

-- Performance Training
('Stage Performance', 'Performance', 'Teaching stage presence and performance skills'),
('Recording Studio', 'Performance', 'Teaching studio recording techniques'),
('Band Coaching', 'Performance', 'Training bands and ensembles'),
('Solo Performance', 'Performance', 'Training individual performers'),
('Public Speaking', 'Performance', 'Teaching presentation and communication skills'),

-- Business and Career
('Music Business', 'Business', 'Teaching music industry and career development'),
('Artist Development', 'Business', 'Guiding artists in their career growth'),
('Music Marketing', 'Business', 'Teaching music promotion and marketing'),
('Copyright and Licensing', 'Business', 'Teaching music rights and legal aspects');

-- Add trigger for updated_at
CREATE TRIGGER update_teacher_specializations_updated_at
BEFORE UPDATE ON public.teacher_specializations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();