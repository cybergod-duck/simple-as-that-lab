-- Add public sharing fields to bots table
ALTER TABLE bots ADD COLUMN IF NOT EXISTS public BOOLEAN DEFAULT FALSE;
ALTER TABLE bots ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_bots_slug ON bots(slug);
CREATE INDEX IF NOT EXISTS idx_bots_public ON bots(public) WHERE public = TRUE;

-- Update RLS policy to allow public viewing of shared bots
DROP POLICY IF EXISTS "Anyone can view public bots" ON bots;
CREATE POLICY "Anyone can view public bots" ON bots
  FOR SELECT USING (public = TRUE);
