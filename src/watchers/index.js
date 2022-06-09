import { setupDBWatcher } from './setup';
import { emitter } from '../eventEmitter';

// eslint-disable-next-line import/prefer-default-export
export const initWatchers = (db) => {
  const createWatcher = setupDBWatcher(db);

  const versionWatcher = createWatcher({
    collection: 'version',
    operationType: 'update',
    fields: ['appVersion'],
  });

  const gamesWatcher = createWatcher({
    collection: 'games',
    operationType: 'insert',
    fields: ['uid'],
  });

  versionWatcher.on('change', ({ appVersion }) =>
    emitter.emit('newVersion', appVersion)
  );

  gamesWatcher.on('change', ({ uid }) => emitter.emit('newGame', uid));
};
