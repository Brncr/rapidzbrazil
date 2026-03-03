-- Table for tracking individual posts/actions by creators
CREATE TABLE IF NOT EXISTS creator_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('influencer', 'community', 'streamer')),
  entity_id UUID NOT NULL,
  
  -- Post info
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'telegram', 'youtube', 'instagram', 'tiktok', 'other')),
  post_url TEXT NOT NULL DEFAULT '',
  post_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  
  -- Metrics
  impressions BIGINT DEFAULT 0,
  views BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  engagement BIGINT DEFAULT 0,
  conversions BIGINT DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE creator_posts ENABLE ROW LEVEL SECURITY;

-- Allow all operations
CREATE POLICY "Allow all access to creator_posts" ON creator_posts
  FOR ALL USING (true) WITH CHECK (true);
