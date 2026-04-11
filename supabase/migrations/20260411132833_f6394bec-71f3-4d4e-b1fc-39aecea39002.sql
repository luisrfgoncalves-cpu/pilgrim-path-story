-- FIX remaining "always true" policies

-- game_rooms: INSERT só pelo host
DROP POLICY IF EXISTS "Authenticated can create rooms" ON public.game_rooms;
CREATE POLICY "Users can create own rooms" ON public.game_rooms
  FOR INSERT TO authenticated
  WITH CHECK (host_id = auth.uid());

-- game_rooms: UPDATE remanescente (dropar a antiga que pode ter ficado)
DROP POLICY IF EXISTS "Authenticated can update rooms" ON public.game_rooms;

-- game_players: INSERT remanescente
DROP POLICY IF EXISTS "Authenticated can create players" ON public.game_players;

-- game_players: UPDATE remanescente  
DROP POLICY IF EXISTS "Authenticated can update players" ON public.game_players;

-- pilgrim_messages: SELECT remanescente
DROP POLICY IF EXISTS "Authenticated can read messages" ON public.pilgrim_messages;

-- pilgrim_support: SELECT remanescente
DROP POLICY IF EXISTS "Authenticated can read supports" ON public.pilgrim_support;