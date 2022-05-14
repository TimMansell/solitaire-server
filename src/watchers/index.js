import EventEmitter from 'eventemitter3';
import { setupDBWatcher } from './setup';

const emitter = new EventEmitter();

export const dbEmitter = () => {
  return {
    on: (...args) => emitter.on(...args),
  };
};

export const initWatchers = (db) => {
  const createWatcher = setupDBWatcher(db);

  const versionWatcher = createWatcher({
    collection: 'version',
    operationType: 'update',
    fields: ['appVersion'],
  });

  const usersWatcher = createWatcher({
    collection: 'users',
    operationType: 'insert',
  });

  const gamesWatcher = createWatcher({
    collection: 'games',
    operationType: 'insert',
    fields: ['uid'],
  });

  versionWatcher.on('change', ({ appVersion }) =>
    emitter.emit('newVersion', appVersion)
  );

  usersWatcher.on('change', () => emitter.emit('newUser'));

  gamesWatcher.on('change', ({ uid }) => emitter.emit('newGame', uid));
};
