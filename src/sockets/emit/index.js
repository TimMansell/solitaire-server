import { setupEmitter } from './setup';
import { dbEmitter } from '#watchers';

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

export const userEmitter = (params) => {
  const { on, init, runMessage, emitUserPlayed, emitCheckVersion } =
    setupEmitter();
  const db = dbEmitter();

  db.on('newGame', (uid) => {
    if (params.uid !== uid) return;

    emitUserPlayed(params);
  });

  db.on('newVersion', (appVersion) =>
    emitCheckVersion({ ...params, appVersion })
  );

  return {
    on,
    init: () => init(params),
    runMessage: (message) => runMessage(message, params),
  };
};
