import { db, emitter } from '../../../setup';

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
    .on('change', async (record) => {
      emitter.emit('newGame', record.fullDocument.uid);
      // if (!socket.user) {
      //   emitCreateUser({ queryDb, emit });
      // }
    });
