-- =====================================================
-- Add "completed" value to activities status enum
-- =====================================================
-- This migration adds the "completed" status option to the
-- enum_activities_status enum type if it doesn't already exist.

-- Check if "completed" already exists in the enum, and add it if not
DO $$
BEGIN
  -- Check if the enum value already exists
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    WHERE enumlabel = 'completed'
    AND enumtypid = (
      SELECT oid
      FROM pg_type
      WHERE typname = 'enum_activities_status'
    )
  ) THEN
    -- Add "completed" to the enum
    ALTER TYPE enum_activities_status ADD VALUE 'completed';
  END IF;
END $$;





