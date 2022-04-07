import lt from 'semver/functions/lt';

// eslint-disable-next-line import/prefer-default-export
export const newUpdate = ({ socket, appVersion }) => {
  const { version } = socket.handshake.query;
  const isOutdated = lt(version, appVersion);

  socket.emit('newUpdate', isOutdated);
};
