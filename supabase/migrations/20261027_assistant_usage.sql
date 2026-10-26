-- Migration: member assistant usage (app/tools/ask, app/api/assistant).
--
-- One row per member per calendar month (UTC, "YYYY-MM"). Tokens count
-- input (including prompt-cache reads and writes) plus output, and bound the
-- monthly cap in lib/assistant/limits.js. `day` and `day_messages` hold
-- today's message count for the daily cap: a new day resets the count on the
-- next write, and a new month starts a new row.
--
-- Only counts live here. Never store questions, answers or any other free
-- text in this table.
--
-- Members may read their own row (for the usage meter). Writes happen only
-- through assistant_usage_record(), which only the service role may execute,
-- so a member can't lower their own counts.
--
-- Idempotent: re-running is safe.

CREATE TABLE IF NOT EXISTS assistant_usage (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL CHECK (month ~ '^\d{4}-\d{2}$'),
  input_tokens BIGINT NOT NULL DEFAULT 0 CHECK (input_tokens >= 0),
  output_tokens BIGINT NOT NULL DEFAULT 0 CHECK (output_tokens >= 0),
  messages INTEGER NOT NULL DEFAULT 0 CHECK (messages >= 0),
  day DATE,
  day_messages INTEGER NOT NULL DEFAULT 0 CHECK (day_messages >= 0),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, month)
);

ALTER TABLE assistant_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own assistant usage" ON assistant_usage;
CREATE POLICY "Users can view own assistant usage" ON assistant_usage
  FOR SELECT USING (auth.uid() = user_id);

-- No INSERT, UPDATE or DELETE policies: with RLS on, members can't write.
-- The service role bypasses RLS and writes through the function below.

CREATE OR REPLACE FUNCTION assistant_usage_record(
  p_user_id UUID,
  p_month TEXT,
  p_day DATE,
  p_input BIGINT,
  p_output BIGINT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO assistant_usage AS u (
    user_id, month, input_tokens, output_tokens, messages, day, day_messages, last_message_at
  )
  VALUES (
    p_user_id, p_month, GREATEST(p_input, 0), GREATEST(p_output, 0), 1, p_day, 1, now()
  )
  ON CONFLICT (user_id, month) DO UPDATE SET
    input_tokens = u.input_tokens + GREATEST(p_input, 0),
    output_tokens = u.output_tokens + GREATEST(p_output, 0),
    messages = u.messages + 1,
    day_messages = CASE WHEN u.day = p_day THEN u.day_messages + 1 ELSE 1 END,
    day = p_day,
    last_message_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

REVOKE ALL ON FUNCTION assistant_usage_record(UUID, TEXT, DATE, BIGINT, BIGINT) FROM PUBLIC;
REVOKE ALL ON FUNCTION assistant_usage_record(UUID, TEXT, DATE, BIGINT, BIGINT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION assistant_usage_record(UUID, TEXT, DATE, BIGINT, BIGINT) TO service_role;
