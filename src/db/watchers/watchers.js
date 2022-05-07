import EventEmitter from 'eventemitter3';
import { db } from '../setup';

const emitter = new EventEmitter();

export const watchDB = () => ({
  on: (event, cb) => emitter.on(event, cb),
});

export const onVersionUpdate = () =>
  db()
    .collection('version')
    .watch([
      {
        $match: {
          operationType: 'update',
        },
      },
    ])
    .on('change', (record) => {
      const { appVersion } = record.updateDescription.updatedFields;

      if (!appVersion) return;

      emitter.emit('newVersion', appVersion);
    });

export const onUsersUpdate = () =>
  db()
    .collection('users')
    .watch([
      {
        $match: {
          operationType: 'insert',
        },
      },
    ])
    .on('change', () => emitter.emit('newUser'));

export const onGamesUpdate = () =>
  db()
    .collection('games')
    .watch([
      {
        $match: {
          operationType: 'insert',
        },
      },
    ])
    .on('change', (record) => {
      emitter.emit('newGame', record.fullDocument.uid);
      // if (!socket.user) {
      //   createUser({ queryDb, emit });
      // }
    });
