// eslint-disable-next-line import/prefer-default-export
export const setupDBWatcher =
  (db) =>
  ({ collection, operationType }) =>
    db.collection(collection).watch([
      {
        $match: {
          operationType,
        },
      },
    ]);
