import { newEmitter } from '../emit';
import { watchDB } from '#db/watchers/watchers';

// eslint-disable-next-line import/prefer-default-export
export const newGlobal = (sockets) => {
  const { on, emitGlobalPlayed, emitPlayerCount, emitOnlinePlayerCount } =
    newEmitter();
  const db = watchDB();

  db.on('newGame', () => emitGlobalPlayed());
  db.on('newUser', () => emitPlayerCount());

  return {
    on,
    updateOnlineCount: () => emitOnlinePlayerCount(sockets),
  };
};
