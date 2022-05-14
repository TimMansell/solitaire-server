import { setupEmitter } from '../emit';
import { dbEmitter } from '#watchers';

// eslint-disable-next-line import/prefer-default-export
export const userEmitter = (params) => {
  const {
    on,
    init,
    runMessage,
    // emitCreateUser,
    emitUserPlayed,
    emitCheckVersion,
  } = setupEmitter();
  const db = dbEmitter();
  // const user = await getUserByUid(params);

  db.on('newGame', (uid) => {
    if (params.uid !== uid) return;

    emitUserPlayed(params);
    // if (!user) emitCreateUser(params);
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
