import EventEmitter from 'eventemitter3';
import { setupEmit, createEmitter, formatPayload } from './helpers';
import { checkVersion } from './app';
import { initGame, newGame } from './game';
import { createUser, getUserDetails, getUserGames } from './user';
import {
  getStats,
  getUserPlayed,
  getGlobalPlayed,
  getPlayerCount,
  getOnlineCount,
  getLeaderboards,
} from './stats';
import { saveGame } from '#db';

// eslint-disable-next-line import/prefer-default-export
export const setupEmitter = () => {
  const emitter = new EventEmitter();
  const emit = setupEmit(emitter);

  const emitInitGame = createEmitter(initGame, formatPayload, emit);
  const emitCreateUser = createEmitter(createUser, formatPayload, emit);
  const emitUser = createEmitter(getUserDetails, formatPayload, emit);
  const emitNewGame = createEmitter(saveGame, newGame, formatPayload, emit);
  const emitStats = createEmitter(getStats, formatPayload, emit);
  const emitUserGames = createEmitter(getUserGames, formatPayload, emit);
  const emitLeaderboards = createEmitter(getLeaderboards, formatPayload, emit);
  const emitUserPlayed = createEmitter(getUserPlayed, formatPayload, emit);
  const emitPlayerCount = createEmitter(getPlayerCount, formatPayload, emit);
  const emitGlobalPlayed = createEmitter(getGlobalPlayed, formatPayload, emit);
  const emitOnlineCount = createEmitter(getOnlineCount, formatPayload, emit);
  const emitCheckVersion = createEmitter(checkVersion, formatPayload, emit);

  const emits = {
    emitCreateUser,
    emitUserPlayed,
    emitPlayerCount,
    emitGlobalPlayed,
    emitOnlineCount,
    emitCheckVersion,
  };

  const getOnConnectedEmits = () => [
    emitInitGame,
    emitUser,
    emitUserPlayed,
    emitPlayerCount,
    emitGlobalPlayed,
  ];

  const getMessages = () => ({
    saveGame: emitNewGame,
    userGames: emitUserGames,
    stats: emitStats,
    leaderboards: emitLeaderboards,
  });

  return {
    on: (...args) => emitter.on(...args),
    getOnConnectedEmits,
    getMessages,
    ...emits,
  };
};
