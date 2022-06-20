import { createMessage, formatMessage } from './helpers';
import { checkVersion } from './types/app';
import { newGame } from './types/game';
import { initUser, getUserGames } from './types/user';
import {
  getStats,
  getUserPlayed,
  getGlobalPlayed,
  getPlayerCount,
  getOnlineCount,
  getLeaderboards,
} from './types/stats';
import { saveGame, activateUser } from '#db';

export const initUserMsg = createMessage(initUser, formatMessage);

export const newGameMsg = createMessage(
  saveGame,
  activateUser,
  newGame,
  formatMessage
);

export const userGamesMsg = createMessage(getUserGames, formatMessage);

export const statsMsg = createMessage(getStats, formatMessage);

export const leaderboardsMsg = createMessage(getLeaderboards, formatMessage);

export const userPlayedMsg = createMessage(getUserPlayed, formatMessage);

export const playerCountMsg = createMessage(getPlayerCount, formatMessage);

export const globalPlayedMsg = createMessage(getGlobalPlayed, formatMessage);

export const onlineCountMsg = createMessage(getOnlineCount, formatMessage);

export const checkVersionMsg = createMessage(checkVersion, formatMessage);

export const mockDeckMsg = createMessage(newGame, formatMessage);
