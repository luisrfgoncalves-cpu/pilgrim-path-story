-- ═══ FIX 1: allowed_emails - restringir leitura apenas ao próprio email ═══
DROP POLICY IF EXISTS "Anyone can check allowed emails" ON public.allowed_emails;
CREATE POLICY "Users can check own email" ON public.allowed_emails
  FOR SELECT USING (
    email = (auth.jwt()->>'email')
  );

-- ═══ FIX 2: game_rooms - UPDATE apenas pelo host ═══
DROP POLICY IF EXISTS "Players can update room" ON public.game_rooms;
CREATE POLICY "Host can update room" ON public.game_rooms
  FOR UPDATE TO authenticated
  USING (host_id = auth.uid());

-- ═══ FIX 3: game_players - INSERT apenas para si próprio ═══
DROP POLICY IF EXISTS "Players can join rooms" ON public.game_players;
CREATE POLICY "Players can join rooms" ON public.game_players
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- FIX 3b: game_players - UPDATE apenas para si próprio
DROP POLICY IF EXISTS "Players can update their data" ON public.game_players;
CREATE POLICY "Players can update own data" ON public.game_players
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ═══ FIX 4: pilgrim_messages - leitura apenas das próprias mensagens ═══
DROP POLICY IF EXISTS "Anyone can read messages" ON public.pilgrim_messages;
CREATE POLICY "Users read own messages" ON public.pilgrim_messages
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ═══ FIX 5: pilgrim_support - leitura apenas para envolvidos ═══
DROP POLICY IF EXISTS "Anyone can view support" ON public.pilgrim_support;
CREATE POLICY "Users see own support" ON public.pilgrim_support
  FOR SELECT TO authenticated
  USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

-- ═══ FIX 6: search_path nas funções mutáveis ═══
CREATE OR REPLACE FUNCTION public.mark_email_used()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $function$
BEGIN
  UPDATE public.allowed_emails
  SET used = true, used_by = NEW.id, used_at = now()
  WHERE email = NEW.email AND used = false;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.kiwify_webhook(jsonb)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $function$
DECLARE
  raw_payload jsonb := $1;
  buyer_email text;
BEGIN
  buyer_email := lower(trim(
    coalesce(
      raw_payload->'Customer'->>'email',
      raw_payload->'customer'->>'email',
      raw_payload->>'email'
    )
  ));

  IF buyer_email IS NOT NULL AND buyer_email <> '' THEN
    INSERT INTO public.allowed_emails (email, used)
    VALUES (buyer_email, false)
    ON CONFLICT (email) DO NOTHING;
  END IF;
END;
$function$;