import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { GameRoom, GamePlayer, generateRoomCode, generateBoard, BOARD_SIZE, PLAYER_COLORS, boardEvents } from '@/lib/multiplayerTypes';
import { toast } from 'sonner';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Guest identity — persists across the session
function getGuestId(): string {
  let id = sessionStorage.getItem('mp_guest_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    sessionStorage.setItem('mp_guest_id', id);
  }
  return id;
}

export function useMultiplayer() {
  const guestId = useRef(getGuestId()).current;
  const [guestName, setGuestName] = useState(() => sessionStorage.getItem('mp_guest_name') || '');
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [myPlayer, setMyPlayer] = useState<GamePlayer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isHostRef = useRef(false);

  // Local authoritative state (host only)
  const localRoomRef = useRef<GameRoom | null>(null);
  const localPlayersRef = useRef<GamePlayer[]>([]);

  const saveGuestName = useCallback((name: string) => {
    setGuestName(name);
    sessionStorage.setItem('mp_guest_name', name);
  }, []);

  // Update myPlayer when players change
  useEffect(() => {
    const me = players.find(p => p.user_id === guestId);
    setMyPlayer(me || null);
  }, [players, guestId]);

  const broadcastState = useCallback(() => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'state_sync',
      payload: {
        room: localRoomRef.current,
        players: localPlayersRef.current,
      },
    });
  }, []);

  const setupChannel = useCallback((roomCode: string) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase.channel(`mp-room:${roomCode}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on('broadcast', { event: 'state_sync' }, (payload) => {
        const { room: r, players: p } = payload.payload;
        if (r) setRoom(r);
        if (p) setPlayers(p);
      })
      .on('broadcast', { event: 'player_join' }, (payload) => {
        if (!isHostRef.current) return;
        const { playerId, playerName } = payload.payload;
        // Check if already in
        if (localPlayersRef.current.find(p => p.user_id === playerId)) {
          broadcastState();
          return;
        }
        if (localPlayersRef.current.length >= 8) return;

        const colorIndex = localPlayersRef.current.length % PLAYER_COLORS.length;
        const newPlayer: GamePlayer = {
          id: playerId,
          room_id: localRoomRef.current?.id || '',
          user_id: playerId,
          display_name: playerName || 'Peregrino',
          position: 0,
          attributes: { fe: 5, coragem: 5, perseveranca: 5, discernimento: 5 },
          is_stunned: false,
          stun_turns: 0,
          finished: false,
          finish_order: null,
          last_dice_roll: null,
          last_event: null,
          color: PLAYER_COLORS[colorIndex],
        };
        localPlayersRef.current = [...localPlayersRef.current, newPlayer];
        broadcastState();
      })
      .on('broadcast', { event: 'player_leave' }, (payload) => {
        if (!isHostRef.current) return;
        const { playerId } = payload.payload;
        localPlayersRef.current = localPlayersRef.current.filter(p => p.user_id !== playerId);
        broadcastState();
      })
      .on('broadcast', { event: 'roll_request' }, (payload) => {
        if (!isHostRef.current) return;
        const { playerId, diceValue } = payload.payload;
        handleRollAsHost(playerId, diceValue);
      })
      .on('broadcast', { event: 'start_request' }, (_payload) => {
        if (!isHostRef.current) return;
        handleStartAsHost();
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
    return channel;
  }, [broadcastState]);

  const handleStartAsHost = useCallback(() => {
    const r = localRoomRef.current;
    const p = localPlayersRef.current;
    if (!r || p.length < 2) return;

    const shuffled = [...p].sort(() => Math.random() - 0.5);
    const turnOrder = shuffled.map(pl => pl.user_id);

    localRoomRef.current = {
      ...r,
      status: 'playing',
      turn_order: turnOrder,
      current_turn_player_id: turnOrder[0],
    };
    broadcastState();
  }, [broadcastState]);

  const handleRollAsHost = useCallback((playerId: string, diceValue: number) => {
    const r = localRoomRef.current;
    const ps = localPlayersRef.current;
    if (!r || r.status !== 'playing') return;
    if (r.current_turn_player_id !== playerId) return;

    const playerIdx = ps.findIndex(p => p.user_id === playerId);
    if (playerIdx === -1) return;
    const player = ps[playerIdx];

    // If stunned, skip turn
    if (player.is_stunned) {
      const updated = [...ps];
      updated[playerIdx] = {
        ...player,
        is_stunned: player.stun_turns <= 1 ? false : true,
        stun_turns: Math.max(0, player.stun_turns - 1),
      };
      localPlayersRef.current = updated;
      advanceTurnAsHost();
      return;
    }

    let newPosition = Math.min(player.position + diceValue, BOARD_SIZE - 1);
    const boardEventId = (r as any).board_events?.[newPosition];
    const event = boardEvents.find(e => e.id === boardEventId);

    let stunTurns = 0;
    let extraMove = 0;
    const attrUpdates: Record<string, number> = {};

    if (event) {
      switch (event.type) {
        case 'advance':
          if (event.effect.target === 'self') extraMove = event.effect.positions || 0;
          break;
        case 'retreat':
          if (event.effect.target === 'self') extraMove = event.effect.positions || 0;
          break;
        case 'stun':
          stunTurns = event.effect.stunTurns || 1;
          break;
        case 'boost':
        case 'safe':
          if (event.effect.attribute && event.effect.amount) {
            attrUpdates[event.effect.attribute] = event.effect.amount;
          }
          break;
        case 'challenge': {
          const challengeRoll = Math.floor(Math.random() * 6) + 1;
          if (challengeRoll >= 4) {
            extraMove = event.effect.positions || 0;
          } else {
            if (event.effect.stunTurns) stunTurns = event.effect.stunTurns;
            else extraMove = -1;
          }
          break;
        }
        case 'shield':
          if (event.effect.attribute && event.effect.amount) {
            attrUpdates[event.effect.attribute] = event.effect.amount;
          }
          break;
      }

      // Broadcast the event
      channelRef.current?.send({
        type: 'broadcast',
        event: 'turn_event',
        payload: {
          playerName: player.display_name,
          diceValue,
          event,
          position: newPosition,
        },
      });
    }

    newPosition = Math.max(0, Math.min(BOARD_SIZE - 1, newPosition + extraMove));
    const finished = newPosition >= BOARD_SIZE - 1;
    const finishOrder = finished ? ps.filter(p => p.finished).length + 1 : null;

    const newAttrs = { ...player.attributes };
    for (const [attr, amount] of Object.entries(attrUpdates)) {
      if (attr in newAttrs) {
        (newAttrs as any)[attr] = Math.max(0, Math.min(12, (newAttrs as any)[attr] + amount));
      }
    }

    const updated = [...ps];
    updated[playerIdx] = {
      ...player,
      position: newPosition,
      last_dice_roll: diceValue,
      last_event: event?.title || null,
      is_stunned: stunTurns > 0,
      stun_turns: stunTurns,
      finished,
      finish_order: finishOrder,
      attributes: newAttrs,
    };
    localPlayersRef.current = updated;

    if (finished) {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'game_over',
        payload: { winnerName: player.display_name },
      });

      const allFinished = updated.every(p => p.finished);
      if (allFinished) {
        localRoomRef.current = { ...localRoomRef.current!, status: 'finished' };
      }
    }

    broadcastState();

    if (!finished) {
      setTimeout(() => advanceTurnAsHost(), 300);
    }
  }, [broadcastState]);

  const advanceTurnAsHost = useCallback(() => {
    const r = localRoomRef.current;
    const ps = localPlayersRef.current;
    if (!r) return;

    const order = r.turn_order;
    const currentIdx = order.indexOf(r.current_turn_player_id || '');
    let nextIdx = (currentIdx + 1) % order.length;
    let attempts = 0;

    while (attempts < order.length) {
      const nextPlayer = ps.find(p => p.user_id === order[nextIdx]);
      if (nextPlayer && !nextPlayer.finished) break;
      nextIdx = (nextIdx + 1) % order.length;
      attempts++;
    }

    localRoomRef.current = { ...r, current_turn_player_id: order[nextIdx] };
    broadcastState();
  }, [broadcastState]);

  const createRoom = useCallback(async () => {
    if (!guestName.trim()) {
      setError('Digite seu nome primeiro');
      return null;
    }
    setLoading(true);
    setError(null);

    const code = generateRoomCode();
    const roomId = 'room_' + code;
    const boardEvts = generateBoard(Date.now());

    const newRoom: GameRoom = {
      id: roomId,
      code,
      host_id: guestId,
      status: 'waiting',
      max_players: 8,
      current_turn_player_id: null,
      turn_order: [],
      board_size: BOARD_SIZE,
      created_at: new Date().toISOString(),
      board_events: boardEvts,
    } as any;

    const hostPlayer: GamePlayer = {
      id: guestId,
      room_id: roomId,
      user_id: guestId,
      display_name: guestName.trim(),
      position: 0,
      attributes: { fe: 5, coragem: 5, perseveranca: 5, discernimento: 5 },
      is_stunned: false,
      stun_turns: 0,
      finished: false,
      finish_order: null,
      last_dice_roll: null,
      last_event: null,
      color: PLAYER_COLORS[0],
    };

    isHostRef.current = true;
    localRoomRef.current = newRoom;
    localPlayersRef.current = [hostPlayer];

    setupChannel(code);

    setRoom(newRoom);
    setPlayers([hostPlayer]);
    setLoading(false);

    // Broadcast initial state after a short delay for channel to be ready
    setTimeout(() => broadcastState(), 500);

    return newRoom;
  }, [guestId, guestName, setupChannel, broadcastState]);

  const joinRoom = useCallback(async (code: string) => {
    if (!guestName.trim()) {
      setError('Digite seu nome primeiro');
      return false;
    }
    setLoading(true);
    setError(null);

    const channel = setupChannel(code.toUpperCase());

    // Wait for channel to be ready, then request to join
    setTimeout(() => {
      channel?.send({
        type: 'broadcast',
        event: 'player_join',
        payload: {
          playerId: guestId,
          playerName: guestName.trim(),
        },
      });
    }, 1000);

    setLoading(false);
    return true;
  }, [guestId, guestName, setupChannel]);

  const startGame = useCallback(() => {
    if (isHostRef.current) {
      handleStartAsHost();
    } else {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'start_request',
        payload: {},
      });
    }
  }, [handleStartAsHost]);

  const rollDice = useCallback((manualValue?: number) => {
    const diceValue = manualValue || (Math.floor(Math.random() * 6) + 1);

    if (isHostRef.current) {
      handleRollAsHost(guestId, diceValue);
    } else {
      channelRef.current?.send({
        type: 'broadcast',
        event: 'roll_request',
        payload: { playerId: guestId, diceValue },
      });
    }
  }, [guestId, handleRollAsHost]);

  const leaveRoom = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'player_leave',
        payload: { playerId: guestId },
      });
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    isHostRef.current = false;
    localRoomRef.current = null;
    localPlayersRef.current = [];
    setRoom(null);
    setPlayers([]);
    setMyPlayer(null);
  }, [guestId]);

  return {
    room,
    players,
    myPlayer,
    loading,
    error,
    guestName,
    setGuestName: saveGuestName,
    createRoom,
    joinRoom,
    startGame,
    rollDice,
    leaveRoom,
    isMyTurn: room?.current_turn_player_id === guestId,
    isHost: isHostRef.current,
    guestId,
  };
}
