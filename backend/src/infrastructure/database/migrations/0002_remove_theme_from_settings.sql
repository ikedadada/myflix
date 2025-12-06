PRAGMA foreign_keys = ON;

-- Drop theme column by rebuilding the table without it
CREATE TABLE IF NOT EXISTS settings_new (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL,
  autoplay INTEGER NOT NULL CHECK (autoplay IN (0, 1)),
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(owner_id)
);

INSERT INTO settings_new (id, owner_id, autoplay)
SELECT id, owner_id, autoplay FROM settings;

DROP TABLE settings;
ALTER TABLE settings_new RENAME TO settings;
