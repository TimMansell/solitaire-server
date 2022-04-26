import lt from 'semver/functions/lt';

export const checkGameStarted = ({ hasGameStarted }) =>
  JSON.parse(hasGameStarted);

export const checkVersion = ({ version, appVersion }) =>
  lt(version, appVersion);
