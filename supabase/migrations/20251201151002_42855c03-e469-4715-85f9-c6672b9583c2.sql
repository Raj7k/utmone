-- Add variant URL columns to experiments table
ALTER TABLE experiments
ADD COLUMN variant_a_url TEXT,
ADD COLUMN variant_b_url TEXT;