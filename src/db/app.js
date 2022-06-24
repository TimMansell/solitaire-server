import { db } from './setup';

// eslint-disable-next-line import/prefer-default-export
export const getVersion = async (params) => {
  const { version: appVersion } = await db()
    .collection('version')
    .findOne({ type: 'app' }, { projection: { _id: 0, version: 1 } });

  return { appVersion, ...params };
};

export const updateVersion = async ({ newVersion }) => {
  const { value } = await db()
    .collection('version')
    .findOneAndUpdate(
      { type: 'app' },
      {
        $set: {
          version: newVersion,
        },
      },
      {
        projection: { _id: 0, version: 1 },
        upsert: true,
        returnDocument: 'after',
      }
    );

  return value;
};
