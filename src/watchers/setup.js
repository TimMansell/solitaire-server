import { formatSet, formatProject, formatFilter, formatExists } from './format';

// eslint-disable-next-line import/prefer-default-export
export const setupDBWatcher =
  (db) =>
  ({ collection, operationType, filterOn = [], fields = [] }) => {
    return db.collection(collection).watch(
      [
        {
          $match: {
            $and: [
              {
                ...formatFilter(filterOn),
                ...formatExists(fields),
                operationType,
              },
            ],
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
