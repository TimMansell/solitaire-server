import lt from 'semver/functions/lt';

// eslint-disable-next-line import/prefer-default-export
export const checkVersion = ({ version, appVersion }) => {
  const isOutdated = lt(version, appVersion);

  return ['newUpdate', isOutdated];
};
