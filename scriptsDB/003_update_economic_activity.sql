
ALTER TABLE suppliers 
ALTER COLUMN economic_activity TYPE JSONB USING 
  CASE 
    WHEN economic_activity IS NULL OR economic_activity = '' THEN '[]'::jsonb
    ELSE jsonb_build_array(economic_activity)
  END;

ALTER TABLE suppliers 
ADD CONSTRAINT check_economic_activity_format 
CHECK (
  economic_activity IS NULL OR 
  (
    jsonb_typeof(economic_activity) = 'array' AND
    (
      SELECT bool_and(
        jsonb_typeof(value) = 'string' AND 
        length(value::text) = 6 AND 
        value::text ~ '^"[0-9]{4}"$'
      )
      FROM jsonb_array_elements(economic_activity) AS value
    )
  )
);


CREATE INDEX IF NOT EXISTS idx_suppliers_economic_activity ON suppliers USING GIN (economic_activity);


UPDATE suppliers 
SET economic_activity = '[]'::jsonb 
WHERE economic_activity IS NULL OR economic_activity = '[]'::jsonb;
