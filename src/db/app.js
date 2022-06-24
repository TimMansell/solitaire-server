import { db } from './setup';

// eslint-disable-next-line import/prefer-default-export
export const getVersion = async (params) => {
  const { version: appVersion } = await db()
    .collection('version')
    .findOne({ type: 'app' }, { projection: { _id: 0, version: 1 } });

  return { appVersion, ...params };
};
