
-- Create storage bucket for TTS audio cache
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('tts-cache', 'tts-cache', true, 1048576, ARRAY['audio/mpeg', 'audio/mp3', 'audio/ogg']);

-- Public read access - anyone can listen to cached audio
CREATE POLICY "Public read access for TTS cache"
ON storage.objects FOR SELECT
USING (bucket_id = 'tts-cache');

-- Only service role (edge functions) can upload audio
-- No INSERT policy for authenticated/anon = only service_role can write
CREATE POLICY "Service role can upload TTS audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'tts-cache' AND auth.role() = 'service_role');
