-- Event Plans
CREATE TABLE event_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  days INTEGER DEFAULT 3,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE event_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to event_plans" ON event_plans FOR ALL USING (true) WITH CHECK (true);

-- Event Influencers
CREATE TABLE event_influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES event_plans(id) ON DELETE CASCADE,
  influencer_id UUID NOT NULL,
  influencer_name TEXT NOT NULL,
  influencer_image TEXT,
  travel_aid NUMERIC(10,2) DEFAULT 0,
  confirmed BOOLEAN DEFAULT false,
  notes TEXT
);

ALTER TABLE event_influencers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to event_influencers" ON event_influencers FOR ALL USING (true) WITH CHECK (true);

-- Event Expenses
CREATE TABLE event_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES event_plans(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('house','food','drinks','transport','merch','other')),
  description TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  per_day BOOLEAN DEFAULT false
);

ALTER TABLE event_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to event_expenses" ON event_expenses FOR ALL USING (true) WITH CHECK (true);

-- Event Activities
CREATE TABLE event_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES event_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  platform TEXT,
  type TEXT,
  description TEXT,
  required BOOLEAN DEFAULT true
);

ALTER TABLE event_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to event_activities" ON event_activities FOR ALL USING (true) WITH CHECK (true);
