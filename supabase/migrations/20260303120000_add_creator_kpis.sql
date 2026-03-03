-- Drop old table if exists and recreate with Rapidz funnel fields
DROP TABLE IF EXISTS creator_kpis;

CREATE TABLE creator_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('influencer', 'community', 'streamer')),
  entity_id UUID NOT NULL,
  period TEXT NOT NULL DEFAULT '',

  -- Nível 2: Funil por Creator
  impressions BIGINT,
  clicks BIGINT,
  telegram_members BIGINT,
  telegram_engagement_pct NUMERIC(5,2),
  downloads BIGINT,
  kyc_completed BIGINT,
  first_deposit BIGINT,
  topup BIGINT,
  volume_usd NUMERIC(14,2),
  recurrence_pct NUMERIC(5,2),

  -- Nível 3: Creator Performance
  cac_per_active_user NUMERIC(10,2),
  retention_30d_pct NUMERIC(5,2),
  ltv_projected NUMERIC(10,2),

  -- General
  score INTEGER CHECK (score >= 1 AND score <= 10),
  notes TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(entity_type, entity_id, period)
);

-- Enable RLS
ALTER TABLE creator_kpis ENABLE ROW LEVEL SECURITY;

-- Allow all operations (public access, same pattern as other tables)
CREATE POLICY "Allow all access to creator_kpis" ON creator_kpis
  FOR ALL USING (true) WITH CHECK (true);
