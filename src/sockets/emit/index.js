import EventEmitter from 'eventemitter3';
import { checkVersion } from './app';
import { initGame, saveGame } from './game';
import { getUserDetails, getUserGames } from './user';
import {
  stats,
  getUserPlayed,
  getGlobalPlayed,
  getPlayerCount,
  getOnlinePlayerCount,
  leaderboards,
} from './stats';

const pipeAwait =
  (...fns) =>
  (param) =>
    fns.reduce(async (result, fn) => fn(await result), param);

const setupEmit = (emitter) => (payload) => emitter.emit('message', payload);

const format = ([name, payload]) => JSON.stringify({ name, payload });

// eslint-disable-next-line import/prefer-default-export
export const newEmitter = () => {
  const emitter = new EventEmitter();
  const emit = setupEmit(emitter);

  const emitInitGame = (params) => pipeAwait(initGame, format, emit)(params);
  const saveGameMsg = (params) => pipeAwait(saveGame, format, emit)(params);
  const emitEuser = (params) => pipeAwait(getUserDetails, format, emit)(params);
  const statsMsg = (params) => pipeAwait(stats, format, emit)(params);
  const userGamesMsg = (params) =>
    pipeAwait(getUserGames, format, emit)(params);
  const leaderboardsMsg = (params) =>
    pipeAwait(leaderboards, format, emit)(params);
  const emitUserPlayed = (params) =>
    pipeAwait(getUserPlayed, format, emit)(params);
  const emitGlobalPlayed = (params) =>
    pipeAwait(getGlobalPlayed, format, emit)(params);
  const emitPlayerCount = () => pipeAwait(getPlayerCount, format, emit)();
  const emitOnlinePlayerCount = (params) =>
    pipeAwait(getOnlinePlayerCount, format, emit)(params);
  const emitCheckVersion = (params) =>
    pipeAwait(checkVersion, format, emit)(params);

  return {
    on: (...args) => emitter.on(...args),
    init: [
      emitInitGame,
      emitEuser,
      emitUserPlayed,
      emitPlayerCount,
      emitGlobalPlayed,
    ],
    messages: [saveGameMsg, userGamesMsg, statsMsg, leaderboardsMsg],
    emitUserPlayed,
    emitPlayerCount,
    emitGlobalPlayed,
    emitOnlinePlayerCount,
    emitCheckVersion,
  };
};
