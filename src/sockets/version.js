import { getVersion } from '../db/version';

// eslint-disable-next-line import/prefer-default-export
export const getLatestVersion = ({ socket }) => {
  const version = getVersion();

  socket.emit('checkVersion', version);
};
