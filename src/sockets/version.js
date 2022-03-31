import semver from 'semver';
import { getVersion } from '#@/db/version';

// eslint-disable-next-line import/prefer-default-export
export const checkVersion = async ({ socket, db, version }) => {
  const latestVersion = await getVersion({ db });
  const isValid = semver.valid(version);
  const isOutdated = !isValid || !semver.eq(version, latestVersion);

  socket.emit('setVersion', { latestVersion, isOutdated });
};
