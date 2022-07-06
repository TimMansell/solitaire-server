import lt from 'semver/functions/lt';
import inc from 'semver/functions/inc';
import { updateVersion } from '#db';

export const checkVersion = ({ version, appVersion }) => {
  const isOutdated = lt(version, appVersion);

  return ['newUpdate', isOutdated];
};

export const incrementVersion = async ({
  version,
  incrementLevel,
  shouldIncrement,
}) => {
  const newVersion = shouldIncrement ? inc(version, incrementLevel) : version;
  const updatedVersion = await updateVersion({ newVersion });

  return ['incrementVersion', updatedVersion];
};
