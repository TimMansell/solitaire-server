import EventEmitter from 'eventemitter3';
import { setupDBWatcher } from './setup';

const emitter = new EventEmitter();

export const watchDB = () => {
  return {
    on: (...args) => emitter.on(...args),
  };
};

// eslint-disable-next-line import/prefer-default-export
export const initWatchers = (db) => {
  const createWatcher = setupDBWatcher(db);

  const versionWatcher = createWatcher({
    collection: 'version',
    operationType: 'update',
  });

  const usersWatcher = createWatcher({
    collection: 'users',
    operationType: 'insert',
  });

  const gamesWatcher = createWatcher({
    collection: 'games',
    operationType: 'insert',
  });

  versionWatcher.on('change', ({ updateDescription }) => {
    const { appVersion } = updateDescription.updatedFields;

    if (!appVersion) return;

    emitter.emit('newVersion', appVersion);
  });

  usersWatcher.on('change', () => emitter.emit('newUser'));

  gamesWatcher.on('change', ({ fullDocument }) =>
    emitter.emit('newGame', fullDocument.uid)
  );
};
