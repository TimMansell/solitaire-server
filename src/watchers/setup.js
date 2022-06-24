import { formatSet, formatProject, formatFilter, formatExists } from './format';

// eslint-disable-next-line import/prefer-default-export
export const setupDBWatcher =
  (db) =>
  ({ collection, operationType, filter = [], fields = [] }) => {
    const filterOn = formatFilter(filter);
    const exists = formatExists(fields);
    const isUpdated = operationType.includes('update');
    const set = formatSet(fields);
    const project = formatProject(fields);

    return db.collection(collection).watch(
      [
        {
          $match: {
            $and: [
              {
                ...filterOn,
                ...(isUpdated && { ...exists }),
                operationType,
              },
            ],
          },
        },
        {
          $set: {
            ...set,
          },
        },
        { $project: { _id: 1, ...project } },
      ],
      { fullDocument: 'updateLookup' }
    );
  };
