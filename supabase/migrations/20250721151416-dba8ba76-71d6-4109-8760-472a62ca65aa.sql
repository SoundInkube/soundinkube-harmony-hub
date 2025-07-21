-- Create comprehensive reference tables for cities, skills, and instruments

-- Create cities table (focusing on India)
CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  state text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  population integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create skills table for music-related skills
CREATE TABLE public.skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create instruments table
CREATE TABLE public.instruments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  category text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view cities" 
ON public.cities 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view skills" 
ON public.skills 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view instruments" 
ON public.instruments 
FOR SELECT 
USING (true);

-- Insert major Indian cities
INSERT INTO public.cities (name, state, population) VALUES
('Mumbai', 'Maharashtra', 12691836),
('Delhi', 'Delhi', 10927986),
('Bengaluru', 'Karnataka', 5104047),
('Kolkata', 'West Bengal', 4631392),
('Chennai', 'Tamil Nadu', 4328063),
('Ahmedabad', 'Gujarat', 3719710),
('Hyderabad', 'Telangana', 3597816),
('Pune', 'Maharashtra', 2935744),
('Surat', 'Gujarat', 2894504),
('Kanpur', 'Uttar Pradesh', 2823249),
('Jaipur', 'Rajasthan', 2711758),
('Lucknow', 'Uttar Pradesh', 2472011),
('Nagpur', 'Maharashtra', 2228018),
('Indore', 'Madhya Pradesh', 1837041),
('Patna', 'Bihar', 1599920),
('Bhopal', 'Madhya Pradesh', 1599914),
('Ludhiana', 'Punjab', 1545368),
('Agra', 'Uttar Pradesh', 1430055),
('Nashik', 'Maharashtra', 1289497),
('Vadodara', 'Gujarat', 1230099),
('Visakhapatnam', 'Andhra Pradesh', 1063178),
('Meerut', 'Uttar Pradesh', 1074229),
('Rajkot', 'Gujarat', 1390933),
('Varanasi', 'Uttar Pradesh', 1198491),
('Srinagar', 'Jammu and Kashmir', 1273312),
('Amritsar', 'Punjab', 1132761),
('Dhanbad', 'Jharkhand', 1196116),
('Allahabad', 'Uttar Pradesh', 1111371),
('Ranchi', 'Jharkhand', 1126741),
('Gwalior', 'Madhya Pradesh', 1101981),
('Coimbatore', 'Tamil Nadu', 1061447),
('Vijayawada', 'Andhra Pradesh', 1048240),
('Jodhpur', 'Rajasthan', 1056128),
('Raipur', 'Chhattisgarh', 1010087),
('Kota', 'Rajasthan', 1001365),
('Chandigarh', 'Chandigarh', 960787),
('Guwahati', 'Assam', 962334),
('Solapur', 'Maharashtra', 951118),
('Hubli', 'Karnataka', 943857),
('Mysore', 'Karnataka', 920550),
('Tiruchirappalli', 'Tamil Nadu', 916857),
('Bareilly', 'Uttar Pradesh', 898167),
('Aligarh', 'Uttar Pradesh', 872575),
('Salem', 'Tamil Nadu', 831038),
('Moradabad', 'Uttar Pradesh', 889810),
('Jalandhar', 'Punjab', 862196),
('Bhubaneswar', 'Odisha', 837737),
('Gorakhpur', 'Uttar Pradesh', 771061),
('Bikaner', 'Rajasthan', 647804),
('Noida', 'Uttar Pradesh', 642381),
('Jamshedpur', 'Jharkhand', 629659),
('Bhilai', 'Chhattisgarh', 625138);

-- Insert comprehensive music skills
INSERT INTO public.skills (name, category) VALUES
-- Technical Skills
('Audio Engineering', 'Technical'),
('Music Production', 'Technical'),
('Sound Design', 'Technical'),
('Mixing', 'Technical'),
('Mastering', 'Technical'),
('Recording', 'Technical'),
('Live Sound', 'Technical'),
('Pro Tools', 'Technical'),
('Logic Pro', 'Technical'),
('Ableton Live', 'Technical'),
('Cubase', 'Technical'),
('FL Studio', 'Technical'),
('Reaper', 'Technical'),
('Studio One', 'Technical'),
('MIDI Programming', 'Technical'),
('Sampling', 'Technical'),
('Beat Making', 'Technical'),
('Synthesis', 'Technical'),

-- Performance Skills
('Live Performance', 'Performance'),
('Stage Presence', 'Performance'),
('Improvisation', 'Performance'),
('Session Musician', 'Performance'),
('Solo Performance', 'Performance'),
('Ensemble Playing', 'Performance'),
('Concert Performance', 'Performance'),
('Studio Performance', 'Performance'),

-- Music Theory
('Music Theory', 'Theory'),
('Composition', 'Theory'),
('Arranging', 'Theory'),
('Songwriting', 'Theory'),
('Orchestration', 'Theory'),
('Harmony', 'Theory'),
('Counterpoint', 'Theory'),
('Music Analysis', 'Theory'),

-- Business Skills
('Music Business', 'Business'),
('Artist Management', 'Business'),
('Music Publishing', 'Business'),
('Music Marketing', 'Business'),
('A&R', 'Business'),
('Music Licensing', 'Business'),
('Artist Development', 'Business'),
('Label Operations', 'Business'),

-- Teaching Skills
('Music Education', 'Teaching'),
('Private Lessons', 'Teaching'),
('Group Instruction', 'Teaching'),
('Music Therapy', 'Teaching'),
('Curriculum Development', 'Teaching'),
('Music Pedagogy', 'Teaching'),

-- Specialized Skills
('Film Scoring', 'Specialized'),
('Game Audio', 'Specialized'),
('Podcast Production', 'Specialized'),
('Voiceover Production', 'Specialized'),
('Radio Production', 'Specialized'),
('Music Supervision', 'Specialized'),
('Audio Post-Production', 'Specialized'),
('Broadcast Audio', 'Specialized');

-- Insert comprehensive musical instruments
INSERT INTO public.instruments (name, category) VALUES
-- String Instruments
('Guitar', 'String'),
('Electric Guitar', 'String'),
('Bass Guitar', 'String'),
('Acoustic Guitar', 'String'),
('Classical Guitar', 'String'),
('Violin', 'String'),
('Viola', 'String'),
('Cello', 'String'),
('Double Bass', 'String'),
('Harp', 'String'),
('Banjo', 'String'),
('Mandolin', 'String'),
('Ukulele', 'String'),
('Sitar', 'String'),
('Tabla', 'String'),
('Sarod', 'String'),
('Santoor', 'String'),
('Veena', 'String'),

-- Wind Instruments
('Flute', 'Wind'),
('Clarinet', 'Wind'),
('Saxophone', 'Wind'),
('Trumpet', 'Wind'),
('Trombone', 'Wind'),
('French Horn', 'Wind'),
('Tuba', 'Wind'),
('Oboe', 'Wind'),
('Bassoon', 'Wind'),
('Piccolo', 'Wind'),
('Recorder', 'Wind'),
('Harmonica', 'Wind'),
('Bagpipes', 'Wind'),
('Bansuri', 'Wind'),
('Shehnai', 'Wind'),

-- Percussion Instruments
('Drums', 'Percussion'),
('Drum Kit', 'Percussion'),
('Snare Drum', 'Percussion'),
('Bass Drum', 'Percussion'),
('Tom-Toms', 'Percussion'),
('Cymbals', 'Percussion'),
('Hi-Hat', 'Percussion'),
('Timpani', 'Percussion'),
('Xylophone', 'Percussion'),
('Marimba', 'Percussion'),
('Vibraphone', 'Percussion'),
('Glockenspiel', 'Percussion'),
('Congas', 'Percussion'),
('Bongos', 'Percussion'),
('Djembe', 'Percussion'),
('Cajon', 'Percussion'),
('Tabla', 'Percussion'),
('Mridangam', 'Percussion'),
('Dholak', 'Percussion'),
('Dhol', 'Percussion'),

-- Keyboard Instruments
('Piano', 'Keyboard'),
('Electric Piano', 'Keyboard'),
('Organ', 'Keyboard'),
('Synthesizer', 'Keyboard'),
('Harpsichord', 'Keyboard'),
('Accordion', 'Keyboard'),
('Harmonium', 'Keyboard'),
('Melodica', 'Keyboard'),

-- Electronic Instruments
('Electronic Drums', 'Electronic'),
('MIDI Controller', 'Electronic'),
('Drum Machine', 'Electronic'),
('Sampler', 'Electronic'),
('Sequencer', 'Electronic'),
('Loop Station', 'Electronic'),
('DJ Controller', 'Electronic'),
('Turntables', 'Electronic'),

-- Vocal
('Vocals', 'Vocal'),
('Lead Vocals', 'Vocal'),
('Backing Vocals', 'Vocal'),
('Choir', 'Vocal'),
('Opera', 'Vocal'),
('Classical Vocals', 'Vocal'),
('Jazz Vocals', 'Vocal'),
('Rock Vocals', 'Vocal'),
('Folk Vocals', 'Vocal');

-- Add triggers for updated_at
CREATE TRIGGER update_cities_updated_at
BEFORE UPDATE ON public.cities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
BEFORE UPDATE ON public.skills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instruments_updated_at
BEFORE UPDATE ON public.instruments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();