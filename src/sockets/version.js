import { getVersion } from '#@/db/version';

// eslint-disable-next-line import/prefer-default-export
export const checkVersion = ({ socket }) => {
  const version = getVersion();

  socket.emit('checkVersion', version);
};
