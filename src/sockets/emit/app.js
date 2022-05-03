import lt from 'semver/functions/lt';

// eslint-disable-next-line import/prefer-default-export
export const emitNewUpdate = ({ version, appVersion }) => {
  const isOutdated = lt(version, appVersion);

  return isOutdated;
};
