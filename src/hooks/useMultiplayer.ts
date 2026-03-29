import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { GameRoom, GamePlayer, generateRoomCode, generateBoard, BOARD_SIZE, PLAYER_COLORS, boardEvents } from '@/lib/multiplayerTypes';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useMultiplayer() {
  const { user, profile } = useAuth();
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [myPlayer, setMyPlayer] = useState<GamePlayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Subscribe to room changes via Realtime
  useEffect(() => {
    if (!room) return;

    const channel = supabase.channel(`room:${room.id}`)
      .on('broadcast', { event: 'room_update' }, (payload) => {
        setRoom(prev => prev ? { ...prev, ...payload.payload } : prev);
      })
      .on('broadcast', { event: 'players_update' }, (payload) => {
        setPlayers(payload.payload.players || []);
      })
      .on('broadcast', { event: 'turn_event' }, (payload) => {
        const { playerName, event, diceValue } = payload.payload;
        if (event) {
          toast(`${playerName}: ${event.emoji} ${event.title}`, { description: event.description });
        }
      })
      .on('broadcast', { event: 'game_over' }, (payload) => {
        toast.success(`🏆 ${payload.payload.winnerName} chegou à Cidade Celestial!`);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [room?.id]);

  // Update myPlayer when players change
  useEffect(() => {
    if (user && players.length > 0) {
      const me = players.find(p => p.user_id === user.id);
      setMyPlayer(me || null);
    }
  }, [players, user]);

  const createRoom = useCallback(async () => {
    if (!user || !profile) {
      setError('Faça login primeiro');
      return null;
    }
    setLoading(true);
    setError(null);

    const code = generateRoomCode();

    const { data: roomData, error: roomErr } = await supabase
      .from('game_rooms')
      .insert({
        code,
        host_id: user.id,
        status: 'waiting',
        max_players: 8,
        board_size: BOARD_SIZE,
        board_events: generateBoard(Date.now()),
        turn_order: [],
        current_turn_player_id: null,
      })
      .select()
      .single();

    if (roomErr || !roomData) {
      setError('Erro ao criar sala');
      setLoading(false);
      return null;
    }

    // Add host as player
    const { data: playerData } = await supabase
      .from('game_players')
      .insert({
        room_id: roomData.id,
        user_id: user.id,
        display_name: profile.display_name || 'Peregrino',
        position: 0,
        color: PLAYER_COLORS[0],
        attributes: { fe: 5, coragem: 5, perseveranca: 5, discernimento: 5 },
      })
      .select()
      .single();

    setRoom(roomData as GameRoom);
    if (playerData) setPlayers([playerData as GamePlayer]);
    setLoading(false);
    return roomData as GameRoom;
  }, [user, profile]);

  const joinRoom = useCallback(async (code: string) => {
    if (!user || !profile) {
      setError('Faça login primeiro');
      return false;
    }
    setLoading(true);
    setError(null);

    const { data: roomData, error: roomErr } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'waiting')
      .single();

    if (roomErr || !roomData) {
      setError('Sala não encontrada ou jogo já começou');
      setLoading(false);
      return false;
    }

    // Check if already in room
    const { data: existing } = await supabase
      .from('game_players')
      .select('id')
      .eq('room_id', roomData.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // Already joined, just load
      await loadRoom(roomData.id);
      setLoading(false);
      return true;
    }

    // Count current players
    const { count } = await supabase
      .from('game_players')
      .select('id', { count: 'exact', head: true })
      .eq('room_id', roomData.id);

    if ((count || 0) >= roomData.max_players) {
      setError('Sala cheia');
      setLoading(false);
      return false;
    }

    const colorIndex = (count || 0) % PLAYER_COLORS.length;

    await supabase
      .from('game_players')
      .insert({
        room_id: roomData.id,
        user_id: user.id,
        display_name: profile.display_name || 'Peregrino',
        position: 0,
        color: PLAYER_COLORS[colorIndex],
        attributes: { fe: 5, coragem: 5, perseveranca: 5, discernimento: 5 },
      });

    await loadRoom(roomData.id);

    // Broadcast to others
    channelRef.current?.send({
      type: 'broadcast',
      event: 'players_update',
      payload: { players },
    });

    setLoading(false);
    return true;
  }, [user, profile]);

  const loadRoom = useCallback(async (roomId: string) => {
    const [{ data: roomData }, { data: playersData }] = await Promise.all([
      supabase.from('game_rooms').select('*').eq('id', roomId).single(),
      supabase.from('game_players').select('*').eq('room_id', roomId).order('created_at'),
    ]);

    if (roomData) setRoom(roomData as GameRoom);
    if (playersData) setPlayers(playersData as GamePlayer[]);
  }, []);

  const startGame = useCallback(async () => {
    if (!room || !user || room.host_id !== user.id) return;
    if (players.length < 2) {
      toast.error('Precisa de pelo menos 2 jogadores');
      return;
    }

    // Shuffle turn order
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const turnOrder = shuffled.map(p => p.user_id);

    await supabase
      .from('game_rooms')
      .update({
        status: 'playing',
        turn_order: turnOrder,
        current_turn_player_id: turnOrder[0],
      })
      .eq('id', room.id);

    const updated = { ...room, status: 'playing' as const, turn_order: turnOrder, current_turn_player_id: turnOrder[0] };
    setRoom(updated);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'room_update',
      payload: updated,
    });
  }, [room, user, players]);

  const rollDice = useCallback(async (manualValue?: number) => {
    if (!room || !myPlayer || !user) return;
    if (room.current_turn_player_id !== user.id) {
      toast.error('Não é sua vez!');
      return;
    }
    if (myPlayer.is_stunned && myPlayer.stun_turns > 0) {
      // Skip turn, reduce stun
      await supabase
        .from('game_players')
        .update({
          is_stunned: myPlayer.stun_turns <= 1 ? false : true,
          stun_turns: Math.max(0, myPlayer.stun_turns - 1),
        })
        .eq('id', myPlayer.id);

      toast('Você está paralisado! Perdeu a vez. 😵');
      await advanceTurn();
      return;
    }

    const diceValue = manualValue || (Math.floor(Math.random() * 6) + 1);
    let newPosition = Math.min(myPlayer.position + diceValue, BOARD_SIZE - 1);

    // Get board event at new position
    const boardEventId = (room as any).board_events?.[newPosition];
    const event = boardEvents.find(e => e.id === boardEventId);

    let stunTurns = 0;
    let extraMove = 0;
    const attrUpdates: Record<string, number> = {};

    if (event) {
      switch (event.type) {
        case 'advance':
          if (event.effect.target === 'self') extraMove = event.effect.positions || 0;
          if (event.effect.target === 'others') {
            // Move all others back
            for (const p of players) {
              if (p.user_id !== user.id && !p.finished) {
                await supabase.from('game_players').update({
                  position: Math.max(0, p.position + (event.effect.positions || 0)),
                }).eq('id', p.id);
              }
            }
          }
          if (event.effect.target === 'all') {
            for (const p of players) {
              if (!p.finished) {
                await supabase.from('game_players').update({
                  position: Math.min(BOARD_SIZE - 1, p.position + (event.effect.positions || 0)),
                }).eq('id', p.id);
              }
            }
          }
          break;
        case 'retreat':
          if (event.effect.target === 'self') extraMove = event.effect.positions || 0;
          if (event.effect.target === 'others') {
            for (const p of players) {
              if (p.user_id !== user.id && !p.finished) {
                await supabase.from('game_players').update({
                  position: Math.max(0, p.position + (event.effect.positions || 0)),
                }).eq('id', p.id);
              }
            }
          }
          break;
        case 'stun':
          stunTurns = event.effect.stunTurns || 1;
          break;
        case 'boost':
          if (event.effect.attribute && event.effect.amount) {
            attrUpdates[event.effect.attribute] = event.effect.amount;
          }
          break;
        case 'challenge':
          // Re-roll needed: 4+ success
          const challengeRoll = Math.floor(Math.random() * 6) + 1;
          if (challengeRoll >= 4) {
            extraMove = event.effect.positions || 0;
            toast.success(`Desafio superado! 🎲 ${challengeRoll}`);
          } else {
            if (event.effect.stunTurns) stunTurns = event.effect.stunTurns;
            else extraMove = -1;
            toast.error(`Falhou no desafio! 🎲 ${challengeRoll}`);
          }
          break;
        case 'safe':
          if (event.effect.attribute && event.effect.amount) {
            attrUpdates[event.effect.attribute] = event.effect.amount;
          }
          break;
      }
    }

    newPosition = Math.max(0, Math.min(BOARD_SIZE - 1, newPosition + extraMove));
    const finished = newPosition >= BOARD_SIZE - 1;
    const finishOrder = finished
      ? players.filter(p => p.finished).length + 1
      : null;

    const newAttrs = { ...myPlayer.attributes };
    for (const [attr, amount] of Object.entries(attrUpdates)) {
      if (attr in newAttrs) {
        (newAttrs as any)[attr] = Math.max(0, Math.min(12, (newAttrs as any)[attr] + amount));
      }
    }

    await supabase
      .from('game_players')
      .update({
        position: newPosition,
        last_dice_roll: diceValue,
        last_event: event?.title || null,
        is_stunned: stunTurns > 0,
        stun_turns: stunTurns,
        finished,
        finish_order: finishOrder,
        attributes: newAttrs,
      })
      .eq('id', myPlayer.id);

    // Broadcast the turn
    channelRef.current?.send({
      type: 'broadcast',
      event: 'turn_event',
      payload: {
        playerName: myPlayer.display_name,
        diceValue,
        event: event || null,
        position: newPosition,
      },
    });

    if (finished) {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'game_over',
        payload: { winnerName: myPlayer.display_name },
      });

      // Check if all finished
      const allFinished = players.every(p => p.user_id === user.id ? true : p.finished);
      if (allFinished || finishOrder === 1) {
        await supabase.from('game_rooms').update({ status: 'finished' }).eq('id', room.id);
      }
    }

    await loadRoom(room.id);

    if (!finished) {
      await advanceTurn();
    }
  }, [room, myPlayer, user, players]);

  const advanceTurn = useCallback(async () => {
    if (!room) return;
    const order = room.turn_order;
    const currentIdx = order.indexOf(room.current_turn_player_id || '');
    let nextIdx = (currentIdx + 1) % order.length;

    // Skip finished players
    let attempts = 0;
    while (attempts < order.length) {
      const nextPlayer = players.find(p => p.user_id === order[nextIdx]);
      if (nextPlayer && !nextPlayer.finished) break;
      nextIdx = (nextIdx + 1) % order.length;
      attempts++;
    }

    const nextPlayerId = order[nextIdx];

    await supabase
      .from('game_rooms')
      .update({ current_turn_player_id: nextPlayerId })
      .eq('id', room.id);

    const updated = { ...room, current_turn_player_id: nextPlayerId };
    setRoom(updated);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'room_update',
      payload: updated,
    });
  }, [room, players]);

  const leaveRoom = useCallback(async () => {
    if (!room || !user) return;
    await supabase.from('game_players').delete().eq('room_id', room.id).eq('user_id', user.id);
    setRoom(null);
    setPlayers([]);
    setMyPlayer(null);
  }, [room, user]);

  return {
    room,
    players,
    myPlayer,
    loading,
    error,
    createRoom,
    joinRoom,
    startGame,
    rollDice,
    leaveRoom,
    loadRoom,
    isMyTurn: room?.current_turn_player_id === user?.id,
    isHost: room?.host_id === user?.id,
  };
}
