CREATE TABLE IF NOT EXISTS public.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  is_done boolean NOT NULL DEFAULT false,
  owner_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.todos (title, is_done, owner_id)
VALUES
  ('First todo', false, 'seed-user'),
  ('Second todo', true, 'seed-user')
ON CONFLICT DO NOTHING;
