-- ============================================================
-- Dispatch — Profile avatars
-- A circular profile image each user uploads in settings, shown
-- across the app (topbar, team list) for team collaboration.
-- ============================================================

-- 1. Store the rendered avatar URL on the profile.
ALTER TABLE public.profiles ADD COLUMN avatar_url text;

-- 2. Public bucket: avatars are low-sensitivity and rendered for every
-- teammate across the UI, so a stable public URL is simplest. Files live
-- under {user_id}/{uuid}.{ext}; the folder prefix scopes write access.
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Writes are restricted to each user's own folder; reads are public.
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view avatar objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
