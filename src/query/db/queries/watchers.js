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
      emitter.emit('versionUpdate', record);
      //   emitNewUpdate({ queryParams, emit });
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
    .on('change', () => {
      emitter.emit('usersUpdate');
      // emitPlayerCount({ queryDb, emit: globalEmit });
    });

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
      emitter.emit('gamesUpdate', record.fullDocument.uid);
      // if (!socket.user) {
      //   emitCreateUser({ queryDb, emit });
      // }
    });
