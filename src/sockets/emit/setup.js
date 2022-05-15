import EventEmitter from 'eventemitter3';
import {
  setupEmit,
  createEmitter,
  formatPayload,
  parsePayload,
} from './helpers';
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

  const messages = {
    saveGame: emitNewGame,
    userGames: emitUserGames,
    stats: emitStats,
    leaderboards: emitLeaderboards,
  };

  const emits = {
    emitCreateUser,
    emitUserPlayed,
    emitPlayerCount,
    emitGlobalPlayed,
    emitOnlineCount,
    emitCheckVersion,
  };

  const init = (params) =>
    [
      emitInitGame,
      emitUser,
      emitUserPlayed,
      emitPlayerCount,
      emitGlobalPlayed,
    ].forEach((runEmit) => runEmit(params));

  const runMessage = (message, params) => {
    const { name, payload } = parsePayload(message);

    const [, runEmit] =
      Object.entries(messages).find(([key]) => key === name) || [];

    if (!runEmit) return console.error('Invalid message name');

    runEmit({ ...params, ...payload });
  };

  return {
    on: (...args) => emitter.on(...args),
    init,
    runMessage,
    ...emits,
  };
};
