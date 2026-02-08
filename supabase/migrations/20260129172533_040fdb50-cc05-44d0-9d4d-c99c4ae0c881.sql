-- Create influencers table
CREATE TABLE public.influencers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  followers TEXT NOT NULL,
  engagement TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create communities table
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  discord_url TEXT,
  twitter_handle TEXT,
  website_url TEXT,
  members TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create streamers table
CREATE TABLE public.streamers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'twitch',
  handle TEXT NOT NULL,
  followers TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  twitch_url TEXT,
  youtube_url TEXT,
  twitter_handle TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, no auth required for this presentation)
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streamers ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view)
CREATE POLICY "Anyone can view influencers" ON public.influencers FOR SELECT USING (true);
CREATE POLICY "Anyone can view communities" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Anyone can view streamers" ON public.streamers FOR SELECT USING (true);

-- Public write policies (for dashboard editing without login)
CREATE POLICY "Anyone can insert influencers" ON public.influencers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update influencers" ON public.influencers FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert communities" ON public.communities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update communities" ON public.communities FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert streamers" ON public.streamers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update streamers" ON public.streamers FOR UPDATE USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_influencers_updated_at
  BEFORE UPDATE ON public.influencers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_communities_updated_at
  BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_streamers_updated_at
  BEFORE UPDATE ON public.streamers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();