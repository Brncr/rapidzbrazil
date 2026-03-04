-- Creator Scopes: define escopo de trabalho por plataforma
CREATE TABLE IF NOT EXISTS creator_scopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('influencer', 'community', 'streamer')),
  entity_id UUID NOT NULL,
  period TEXT NOT NULL DEFAULT '',
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'telegram', 'youtube', 'instagram', 'tiktok', 'other')),
  post_count INTEGER DEFAULT 0,
  frequency TEXT DEFAULT '',
  themes TEXT DEFAULT '',
  formats TEXT DEFAULT '',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entity_type, entity_id, period, platform)
);

ALTER TABLE creator_scopes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to creator_scopes" ON creator_scopes
  FOR ALL USING (true) WITH CHECK (true);

-- Creator Tasks: tarefas do escopo
CREATE TABLE IF NOT EXISTS creator_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('influencer', 'community', 'streamer')),
  entity_id UUID NOT NULL,
  scope_id UUID REFERENCES creator_scopes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'telegram', 'youtube', 'instagram', 'tiktok', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE creator_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to creator_tasks" ON creator_tasks
  FOR ALL USING (true) WITH CHECK (true);
