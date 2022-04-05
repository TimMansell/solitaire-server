// eslint-disable-next-line import/prefer-default-export
export const watchVersion = (db) =>
  db.collection('version').watch([
    {
      $match: {
        operationType: 'update',
      },
    },
  ]);
