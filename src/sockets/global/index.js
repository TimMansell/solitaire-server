import { setupEmitter } from '../emit';
import { dbEmitter } from '#watchers';

// eslint-disable-next-line import/prefer-default-export
export const globalEmitter = () => {
  const { on, emitGlobalPlayed, emitPlayerCount, emitOnlineCount } =
    setupEmitter();
  const db = dbEmitter();

  db.on('newGame', emitGlobalPlayed);
  db.on('newUser', emitPlayerCount);

  return {
    on,
    updateOnlineCount: emitOnlineCount,
  };
};
