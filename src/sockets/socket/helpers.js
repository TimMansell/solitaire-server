import queryString from 'query-string';
import {
  initUserMsg,
  userPlayedMsg,
  playerCountMsg,
  globalPlayedMsg,
  newGameMsg,
  userGamesMsg,
  statsMsg,
  leaderboardsMsg,
  onlineCountMsg,
  checkVersionMsg,
  mockDeckMsg,
} from '../messages';
import { isTest } from '#src/main';

export const upgradeSocket = (socket, query, ...params) =>
  socket.handleUpgrade(...params, (ws) => socket.emit('connection', ws, query));

export const createGlobalSend = (sockets) => async (message) => {
  const response = await message()();

  if (!response) return;

  sockets.clients.forEach((client) => client.send(response));
};

export const createSend = (ws, params) => async (message) => {
  const response = await message()(params);

  if (!response) return;

  ws.send(response);
};

export const getParams = ({ url }) => {
  const params = queryString.parseUrl(url, {
    parseBooleans: true,
  });

  return params;
};

export const checkIsUser = (uid, params) => uid === params.uid;

export const getMessage = (message) => {
  try {
    const { name, payload } = JSON.parse(message);

    const messages = {
      userPlayed: userPlayedMsg,
      playerCount: playerCountMsg,
      globalPlayed: globalPlayedMsg,
      saveGame: newGameMsg,
      userGames: userGamesMsg,
      stats: statsMsg,
      leaderboards: leaderboardsMsg,
      ...(isTest && { mockDeck: mockDeckMsg }),
    };

    const [msg, emit] =
      Object.entries(messages).find(([key]) => key === name) || [];

    if (!msg) throw new Error('Invalid message name');

    return () => emit(payload);
  } catch (error) {
    return console.error({ error });
  }
};

export const updateGlobalPlayed = () => globalPlayedMsg();

export const updateOnlineCount = (sockets) => () => onlineCountMsg({ sockets });

export const updatePlayerCount = () => playerCountMsg();

export const updateUserPlayed = () => userPlayedMsg();

export const initUser = () => initUserMsg();

export const checkVersion = (appVersion) => () =>
  checkVersionMsg({ appVersion });
