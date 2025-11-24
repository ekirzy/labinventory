-- Update Items Table
ALTER TABLE items ADD COLUMN IF NOT EXISTS "serialNumber" text;
ALTER TABLE items ADD COLUMN IF NOT EXISTS "acquisitionDate" text; -- Just in case it's missing

-- Update Labs Table
ALTER TABLE labs ADD COLUMN IF NOT EXISTS manager text;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS capacity integer;
ALTER TABLE labs ADD COLUMN IF NOT EXISTS "safetyLevel" text;
