import EventEmitter from 'eventemitter3';
import { setupEmit } from '../emit';
import {
  getGlobalPlayed,
  getPlayerCount,
  getOnlinePlayerCount,
} from '../emit/stats';
import { watchDB } from '#db/watchers/watchers';

const pipeAwait =
  (...fns) =>
  (param) =>
    fns.reduce(async (result, fn) => fn(await result), param);

// eslint-disable-next-line import/prefer-default-export
export const newGlobal = (sockets) => {
  const emitter = new EventEmitter();
  const emit = setupEmit(emitter);
  const db = watchDB();

  db.on('newGame', () => pipeAwait(getGlobalPlayed, emit)());
  db.on('newUser', () => pipeAwait(getPlayerCount, emit)());

  return {
    on: (event, cb) => emitter.on(event, cb),
    updateOnlineCount: () => pipeAwait(getOnlinePlayerCount, emit)(sockets),
  };
};
