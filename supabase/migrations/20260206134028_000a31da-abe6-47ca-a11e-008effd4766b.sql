-- Add tier column to influencers table
ALTER TABLE public.influencers 
ADD COLUMN tier text DEFAULT 'Small' CHECK (tier IN ('Small', 'Medium', 'Top'));