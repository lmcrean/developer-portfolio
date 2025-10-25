-- Create label_templates table
-- Stores reusable label definitions (e.g., "Waiting on reviewer", "Merge conflicts")
CREATE TABLE IF NOT EXISTS label_templates (
  id SERIAL PRIMARY KEY,
  label_id VARCHAR(255) UNIQUE NOT NULL,
  text VARCHAR(255) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create pr_labels table
-- Maps which labels are assigned to which PRs
CREATE TABLE IF NOT EXISTS pr_labels (
  id SERIAL PRIMARY KEY,
  pr_id INTEGER NOT NULL,
  label_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_label_id FOREIGN KEY (label_id) REFERENCES label_templates(label_id) ON DELETE CASCADE,
  CONSTRAINT unique_pr_label UNIQUE (pr_id, label_id)
);

-- Create pr_order table
-- Stores custom ordering for PRs in tasks view
CREATE TABLE IF NOT EXISTS pr_order (
  pr_id INTEGER PRIMARY KEY,
  display_order INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pr_labels_pr_id ON pr_labels(pr_id);
CREATE INDEX IF NOT EXISTS idx_pr_labels_label_id ON pr_labels(label_id);
CREATE INDEX IF NOT EXISTS idx_pr_order_display_order ON pr_order(display_order);

-- Create updated_at trigger function for label_templates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $BODY$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$BODY$ language 'plpgsql';

-- Create trigger for label_templates
DROP TRIGGER IF EXISTS update_label_templates_updated_at ON label_templates;
CREATE TRIGGER update_label_templates_updated_at
  BEFORE UPDATE ON label_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for pr_order
DROP TRIGGER IF EXISTS update_pr_order_updated_at ON pr_order;
CREATE TRIGGER update_pr_order_updated_at
  BEFORE UPDATE ON pr_order
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
