import { setupDBWatcher } from './setup';
import { emitter } from '../eventEmitter';

// eslint-disable-next-line import/prefer-default-export
export const initWatchers = (db) => {
  const createWatcher = setupDBWatcher(db);

  const versionWatcher = createWatcher({
    collection: 'version',
    operationType: 'update',
    filter: [{ type: 'app' }],
    fields: ['version'],
  });

  const usersWatcher = createWatcher({
    collection: 'users',
    operationType: 'update',
    fields: ['isActive'],
  });

  const gamesWatcher = createWatcher({
    collection: 'games',
    operationType: 'insert',
    fields: ['uid'],
  });

  versionWatcher.on('change', ({ version: appVersion }) =>
    emitter.emit('newVersion', appVersion)
  );

  usersWatcher.on('change', () => emitter.emit('newUser'));

  gamesWatcher.on('change', ({ uid }) => emitter.emit('newGame', uid));
};
