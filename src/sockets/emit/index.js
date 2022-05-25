import { createEmitter, formatPayload } from './helpers';
import { checkVersion } from './emits/app';
import { initGame, newGame } from './emits/game';
import { createUser, getUserDetails, getUserGames } from './emits/user';
import {
  getStats,
  getUserPlayed,
  getGlobalPlayed,
  getPlayerCount,
  getOnlineCount,
  getLeaderboards,
} from './emits/stats';
import { saveGame } from '#db';

export const emitInitGame = createEmitter(initGame, formatPayload);

export const emitCreateUser = createEmitter(createUser, formatPayload);

export const emitUser = createEmitter(getUserDetails, formatPayload);

export const emitNewGame = createEmitter(saveGame, newGame, formatPayload);

export const emitUserGames = createEmitter(getUserGames, formatPayload);

export const emitStats = createEmitter(getStats, formatPayload);

export const emitLeaderboards = createEmitter(getLeaderboards, formatPayload);

export const emitUserPlayed = createEmitter(getUserPlayed, formatPayload);

export const emitPlayerCount = createEmitter(getPlayerCount, formatPayload);

export const emitGlobalPlayed = createEmitter(getGlobalPlayed, formatPayload);

export const emitOnlineCount = createEmitter(getOnlineCount, formatPayload);

export const emitCheckVersion = createEmitter(checkVersion, formatPayload);
