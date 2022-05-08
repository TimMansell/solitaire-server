import EventEmitter from 'eventemitter3';
import { checkVersion } from '../emit/app';
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

const setupEmit =
  (emitter) =>
  ([name, payload]) =>
    emitter.emit('message', { name, payload });

// eslint-disable-next-line import/prefer-default-export
export const newEmitter = () => {
  const emitter = new EventEmitter();
  const emit = setupEmit(emitter);

  const emitInitGame = (params) => pipeAwait(initGame, emit)(params);
  const saveGameMsg = (params) => pipeAwait(saveGame, emit)(params);
  const emitEuser = (params) => pipeAwait(getUserDetails, emit)(params);
  const statsMsg = (params) => pipeAwait(stats, emit)(params);
  const userGamesMsg = (params) => pipeAwait(getUserGames, emit)(params);
  const leaderboardsMsg = (params) => pipeAwait(leaderboards, emit)(params);
  const emitUserPlayed = (params) => pipeAwait(getUserPlayed, emit)(params);
  const emitGlobalPlayed = (params) => pipeAwait(getGlobalPlayed, emit)(params);
  const emitPlayerCount = () => pipeAwait(getPlayerCount, emit)();
  const emitOnlinePlayerCount = (params) =>
    pipeAwait(getOnlinePlayerCount, emit)(params);
  const emitCheckVersion = (params) => pipeAwait(checkVersion, emit)(params);

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
