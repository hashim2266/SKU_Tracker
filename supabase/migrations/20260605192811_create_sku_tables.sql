
CREATE TABLE IF NOT EXISTS kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_name text NOT NULL,
  sub_sku_name text NOT NULL,
  unit text NOT NULL DEFAULT 'Peratus',
  target numeric NOT NULL DEFAULT 100,
  actual numeric NOT NULL DEFAULT 0,
  percentage numeric NOT NULL DEFAULT 0,
  section text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_kpis" ON kpis FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_kpis" ON kpis FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_kpis" ON kpis FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_kpis" ON kpis FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS config (
  id text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_config" ON config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_config" ON config FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "update_config" ON config FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_config" ON config FOR DELETE TO anon, authenticated USING (true);

INSERT INTO config (id, content) VALUES ('remarks', '{"text": "", "updatedAt": ""}') ON CONFLICT (id) DO NOTHING;
