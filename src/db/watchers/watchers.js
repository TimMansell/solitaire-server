import { db, dbEmitter } from '../setup';

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
    .on('change', async (record) => {
      const { appVersion } = record.updateDescription.updatedFields;

      if (!appVersion) return;

      dbEmitter.emit('db.newVersion', appVersion);
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
    .on('change', () => dbEmitter.emit('db.newUser'));

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
    .on('change', async (record) => {
      dbEmitter.emit('db.newGame', record.fullDocument.uid);
      // if (!socket.user) {
      //   emitCreateUser({ queryDb, emit });
      // }
    });
