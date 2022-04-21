import lt from 'semver/functions/lt';

// eslint-disable-next-line import/prefer-default-export
export const emitNewUpdate = ({ emit, version, appVersion }) => {
  const isOutdated = lt(version, appVersion);

  emit('newUpdate', isOutdated);
};
