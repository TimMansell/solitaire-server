import lt from 'semver/functions/lt';
import { watchVersion, watchUsers, watchGames } from '#@/db/watch';
import { updateUserStats } from '#@/db/stats';
import { setPlayerCount } from './players';
import { setUserPlayed, setGlobalPlayed } from './stats';

export const watchForVersionUpdate = ({ io, db }) => {
  const changeStream = watchVersion(db);

  changeStream.on('change', async ({ updateDescription }) => {
    const sockets = await io.fetchSockets();
    const { appVersion } = updateDescription.updatedFields;

    if (!appVersion) return;

    sockets.forEach((socket) => {
      const { version } = socket.handshake.query;
      const isOutdated = lt(version, appVersion);

      socket.emit('newUpdate', isOutdated);
    });
  });
};

export const watchForUsersUpdate = ({ io, db }) => {
  const changeStream = watchUsers(db);

  changeStream.on('change', async () => setPlayerCount({ socket: io, db }));
};

export const watchForGamesUpdate = ({ io, db }) => {
  const changeStream = watchGames(db);

  changeStream.on('change', async ({ fullDocument }) => {
    const sockets = await io.fetchSockets();
    const { uid: gameUid } = fullDocument;

    setGlobalPlayed({ socket: io, db });

    sockets.forEach((socket) => {
      const { uid } = socket.handshake.query;

      if (uid !== gameUid) return;

      setUserPlayed({ socket, db, uid });
      updateUserStats(db, uid);
    });
  });
};
