import queryString from 'query-string';
import {
  emitInitGame,
  emitUser,
  emitUserPlayed,
  emitPlayerCount,
  emitGlobalPlayed,
  emitNewGame,
  emitUserGames,
  emitStats,
  emitLeaderboards,
  emitOnlineCount,
  emitCheckVersion,
} from '../emit';

export const createGlobalSend = (sockets) => async (message) => {
  const response = await message()();

  if (!response) return;

  sockets.clients.forEach((client) => client.send(response));
};

export const createSend = (ws, req) => async (message) => {
  const { query } = queryString.parseUrl(req.url, {
    parseBooleans: true,
  });

  const response = await message()(query);

  if (!response) return;

  ws.send(response);
};

export const getUid = (req) => {
  const {
    query: { uid },
  } = queryString.parseUrl(req.url, {
    parseBooleans: true,
  });

  return uid;
};

export const getResponseMessage = (message) => {
  try {
    const { name, payload } = JSON.parse(message);

    const messages = {
      initGame: emitInitGame,
      user: emitUser,
      userPlayed: emitUserPlayed,
      playerCount: emitPlayerCount,
      globalPlayed: emitGlobalPlayed,
      saveGame: emitNewGame,
      userGames: emitUserGames,
      stats: emitStats,
      leaderboards: emitLeaderboards,
    };

    const [msg, emit] =
      Object.entries(messages).find(([key]) => key === name) || [];

    if (!msg) return console.error('Invalid message name');

    return () => emit(payload);
  } catch (error) {
    console.log({ error });
  }
};

export const updateGlobalPlayed = () => emitGlobalPlayed();

export const updateOnlineCount = (sockets) => () =>
  emitOnlineCount({ sockets });

export const updatePlayerCount = () => () => emitPlayerCount();

export const updateUserPlayed = () => emitUserPlayed();

export const checkUserVersion = (appVersion) => () =>
  emitCheckVersion({ appVersion });
