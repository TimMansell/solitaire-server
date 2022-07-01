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
  checkVersionUpdateMsg,
  checkVersionMsg,
  mockDeckMsg,
  mockVersionMsg,
} from '../messages';
import { isTest } from '#src/main';

export const createGlobalSend = (sockets) => async (message) => {
  try {
    const response = await message()({ sockets });

    if (!response) return;

    sockets.clients.forEach((client) => client.send(response));
  } catch (error) {
    console.log({ error });
  }
};

export const createSend = (ws, params) => async (message, extraParams) => {
  try {
    const response = await message()({ ...params, ...extraParams });

    if (!response) return;

    ws.send(response);
  } catch (error) {
    console.log({ error });
  }
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
      saveGame: newGameMsg,
      userGames: userGamesMsg,
      stats: statsMsg,
      leaderboards: leaderboardsMsg,
      ...(isTest && { mockDeck: mockDeckMsg }),
      ...(isTest && { playerCount: playerCountMsg }),
      ...(isTest && { mockVersion: mockVersionMsg }),
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

export const updateOnlineCount = () => onlineCountMsg();

export const updatePlayerCount = () => playerCountMsg();

export const updateUserPlayed = () => userPlayedMsg();

export const initUser = () => initUserMsg();

export const checkVersionUpdate = () => checkVersionUpdateMsg();

export const checkVersion = () => checkVersionMsg();
