export const watchVersion = ({ db }) =>
  db.collection('version').watch([
    {
      $match: {
        operationType: 'update',
      },
    },
  ]);

export const watchUsers = ({ db }) =>
  db.collection('users').watch([
    {
      $match: {
        operationType: 'insert',
      },
    },
  ]);

export const watchGames = ({ db }) =>
  db.collection('games').watch([
    {
      $match: {
        operationType: 'insert',
      },
    },
  ]);
