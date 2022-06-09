import { createMessage, formatMessage } from './helpers';
import { checkVersion } from './types/app';
import { initGame, newGame } from './types/game';
import { initUser, getUserGames } from './types/user';
import {
  getStats,
  getUserPlayed,
  getGlobalPlayed,
  getPlayerCount,
  getOnlineCount,
  getLeaderboards,
} from './types/stats';
import { saveGame } from '#db';

export const initGameMsg = createMessage(initGame, formatMessage);

export const initUserMsg = createMessage(initUser, formatMessage);

export const newGameMsg = createMessage(saveGame, newGame, formatMessage);

export const userGamesMsg = createMessage(getUserGames, formatMessage);

export const statsMsg = createMessage(getStats, formatMessage);

export const leaderboardsMsg = createMessage(getLeaderboards, formatMessage);

export const userPlayedMsg = createMessage(getUserPlayed, formatMessage);

export const playerCountMsg = createMessage(getPlayerCount, formatMessage);

export const globalPlayedMsg = createMessage(getGlobalPlayed, formatMessage);

export const onlineCountMsg = createMessage(getOnlineCount, formatMessage);

export const checkVersionMsg = createMessage(checkVersion, formatMessage);
