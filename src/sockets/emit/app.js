import { checkVersion } from '#query/params';

// eslint-disable-next-line import/prefer-default-export
export const emitNewUpdate = ({ queryParams, emit }) => {
  const isOutdated = queryParams(checkVersion);

  emit('newUpdate', isOutdated);
};
