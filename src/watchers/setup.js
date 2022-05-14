import { formatSet, formatProject } from './format';

// eslint-disable-next-line import/prefer-default-export
export const setupDBWatcher =
  (db) =>
  ({ collection, operationType, fields = [] }) => {
    return db.collection(collection).watch(
      [
        {
          $match: {
            operationType,
          },
        },
        {
          $set: {
            ...formatSet(fields),
          },
        },
        { $project: { _id: 1, ...formatProject(fields) } },
      ],
      { fullDocument: 'updateLookup' }
    );
  };
