import lt from 'semver/functions/lt';
import { watchVersion } from '#@/db/watch';

// eslint-disable-next-line import/prefer-default-export
export const watchVersionUpdate = ({ io, db }) => {
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
