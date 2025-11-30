ALTER TABLE videos
  ADD COLUMN thumbnail_key TEXT;

ALTER TABLE videos
  ADD COLUMN thumbnail_status TEXT NOT NULL DEFAULT 'pending' CHECK (thumbnail_status IN ('pending', 'processing', 'succeeded', 'failed'));

ALTER TABLE videos
  ADD COLUMN thumbnail_error TEXT;
