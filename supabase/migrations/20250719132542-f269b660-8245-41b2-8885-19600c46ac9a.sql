-- Update profiles table to support all user types and enhanced information
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC,
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available',
ADD COLUMN IF NOT EXISTS portfolio_urls TEXT[],
ADD COLUMN IF NOT EXISTS genres TEXT[],
ADD COLUMN IF NOT EXISTS instruments TEXT[],
ADD COLUMN IF NOT EXISTS achievements TEXT[],
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS team_size INTEGER;

-- Update user_type enum to include all user types
ALTER TYPE public.user_type RENAME TO user_type_old;
CREATE TYPE public.user_type AS ENUM ('client', 'music_professional', 'record_label', 'artist_manager', 'business');
ALTER TABLE public.profiles ALTER COLUMN user_type TYPE public.user_type USING user_type::text::public.user_type;
DROP TYPE public.user_type_old;

-- Create marketplace table for gear buying/selling
CREATE TABLE public.marketplace (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- guitar, drums, studio_equipment, etc.
  condition TEXT NOT NULL DEFAULT 'good', -- new, excellent, good, fair, poor
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  images TEXT[] DEFAULT '{}',
  location TEXT,
  status TEXT DEFAULT 'available', -- available, sold, pending
  tags TEXT[],
  contact_preference TEXT DEFAULT 'message', -- message, phone, email
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create artist_profiles table (managed by labels/managers)
CREATE TABLE public.artist_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  real_name TEXT,
  bio TEXT,
  genres TEXT[],
  social_media JSONB DEFAULT '{}'::jsonb,
  portfolio_urls TEXT[],
  achievements TEXT[],
  status TEXT DEFAULT 'active', -- active, inactive, on_hiatus
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaborations table for band formation and project requests
CREATE TABLE public.collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[],
  required_instruments TEXT[],
  collaboration_type TEXT NOT NULL, -- band, project, session, tour
  location TEXT,
  compensation_type TEXT, -- paid, revenue_share, exposure, volunteer
  compensation_amount NUMERIC,
  status TEXT DEFAULT 'open', -- open, in_progress, completed, cancelled
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaboration_applications table
CREATE TABLE public.collaboration_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collaboration_id UUID NOT NULL REFERENCES public.collaborations(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(collaboration_id, applicant_id)
);

-- Create gigs table for client requests
CREATE TABLE public.gigs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type TEXT NOT NULL, -- wedding, corporate, party, concert, recording
  location TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours NUMERIC,
  budget_min NUMERIC,
  budget_max NUMERIC,
  required_skills TEXT[],
  required_instruments TEXT[],
  status TEXT DEFAULT 'open', -- open, in_progress, completed, cancelled
  selected_professional_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gig_applications table
CREATE TABLE public.gig_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposal TEXT NOT NULL,
  quoted_price NUMERIC,
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(gig_id, professional_id)
);

-- Create message_requests table for collaboration messaging
CREATE TABLE public.message_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  context_type TEXT, -- collaboration, gig, general
  context_id UUID, -- reference to collaboration or gig
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(sender_id, recipient_id, context_type, context_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.marketplace ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace
CREATE POLICY "Anyone can view marketplace items" ON public.marketplace FOR SELECT USING (status = 'available');
CREATE POLICY "Users can create marketplace items" ON public.marketplace FOR INSERT WITH CHECK (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Sellers can manage their items" ON public.marketplace FOR ALL USING (seller_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for artist_profiles
CREATE POLICY "Anyone can view artist profiles" ON public.artist_profiles FOR SELECT USING (true);
CREATE POLICY "Managers can create artist profiles" ON public.artist_profiles FOR INSERT WITH CHECK (manager_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Managers can manage their artists" ON public.artist_profiles FOR ALL USING (manager_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for collaborations
CREATE POLICY "Anyone can view open collaborations" ON public.collaborations FOR SELECT USING (status = 'open');
CREATE POLICY "Users can create collaborations" ON public.collaborations FOR INSERT WITH CHECK (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Creators can manage their collaborations" ON public.collaborations FOR ALL USING (creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for collaboration_applications
CREATE POLICY "Users can view their applications" ON public.collaboration_applications FOR SELECT USING (applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR collaboration_id IN (SELECT id FROM public.collaborations WHERE creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));
CREATE POLICY "Users can apply to collaborations" ON public.collaboration_applications FOR INSERT WITH CHECK (applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their applications" ON public.collaboration_applications FOR UPDATE USING (applicant_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR collaboration_id IN (SELECT id FROM public.collaborations WHERE creator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));

-- RLS Policies for gigs
CREATE POLICY "Anyone can view open gigs" ON public.gigs FOR SELECT USING (status = 'open');
CREATE POLICY "Clients can create gigs" ON public.gigs FOR INSERT WITH CHECK (client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Clients can manage their gigs" ON public.gigs FOR ALL USING (client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for gig_applications
CREATE POLICY "Users can view their gig applications" ON public.gig_applications FOR SELECT USING (professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR gig_id IN (SELECT id FROM public.gigs WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));
CREATE POLICY "Professionals can apply to gigs" ON public.gig_applications FOR INSERT WITH CHECK (professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update their gig applications" ON public.gig_applications FOR UPDATE USING (professional_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR gig_id IN (SELECT id FROM public.gigs WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())));

-- RLS Policies for message_requests
CREATE POLICY "Users can view their message requests" ON public.message_requests FOR SELECT USING (sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR recipient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can send message requests" ON public.message_requests FOR INSERT WITH CHECK (sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can respond to message requests" ON public.message_requests FOR UPDATE USING (recipient_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_marketplace_updated_at BEFORE UPDATE ON public.marketplace FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_artist_profiles_updated_at BEFORE UPDATE ON public.artist_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gigs_updated_at BEFORE UPDATE ON public.gigs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_marketplace_seller_id ON public.marketplace(seller_id);
CREATE INDEX idx_marketplace_category ON public.marketplace(category);
CREATE INDEX idx_marketplace_status ON public.marketplace(status);
CREATE INDEX idx_artist_profiles_manager_id ON public.artist_profiles(manager_id);
CREATE INDEX idx_collaborations_creator_id ON public.collaborations(creator_id);
CREATE INDEX idx_collaborations_status ON public.collaborations(status);
CREATE INDEX idx_gigs_client_id ON public.gigs(client_id);
CREATE INDEX idx_gigs_status ON public.gigs(status);
CREATE INDEX idx_message_requests_sender_recipient ON public.message_requests(sender_id, recipient_id);