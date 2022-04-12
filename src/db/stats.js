export const getStats = async ({ db }, filter) => {
  const [games] = await db
    .collection('games')
    .aggregate([
      {
        $facet: {
          completed: [
            { $match: { ...filter, completed: true } },
            { $count: 'count' },
          ],
          won: [{ $match: { ...filter, won: true } }, { $count: 'count' }],
          lost: [{ $match: { ...filter, lost: true } }, { $count: 'count' }],
          quit: [
            { $match: { ...filter, won: false, lost: false, completed: true } },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          completed: {
            $ifNull: [{ $first: '$completed.count' }, 0],
          },
          won: {
            $ifNull: [{ $first: '$won.count' }, 0],
          },
          lost: {
            $ifNull: [{ $first: '$lost.count' }, 0],
          },
          quit: {
            $ifNull: [{ $first: '$quit.count' }, 0],
          },
        },
      },
    ])
    .toArray();

  return games;
};

export const getPlayers = ({ db }) => db.collection('users').countDocuments({});

export const getUserGameCount = ({ db, uid }) =>
  db.collection('games').countDocuments({ uid });

export const getGlobalGameCount = ({ db }) =>
  db.collection('games').countDocuments({});

export const getAllGames = (db) =>
  db.collection('games').find({}, { _id: 0 }).toArray();

export const getGameLeaderboards = async ({ db }, { showBest, limit }) => {
  const games = await db
    .collection('games')
    .find(
      { won: true },
      { projection: { _id: 0, date: 1, uid: 1, [showBest]: 1 } }
    )
    .limit(limit)
    .sort({ [showBest]: 1, date: 1 })
    .toArray();

  const uids = [...new Set(games.map(({ uid }) => uid))];

  const users = await db
    .collection('users')
    .find({ uid: { $in: uids } }, { projection: { _id: 0, uid: 1, name: 1 } })
    .toArray();

  const result = games.map(({ uid, ...rest }) => {
    const { name } = users.find((user) => user.uid === uid);

    return {
      ...rest,
      name,
    };
  });

  return result;
};

export const getUserLeaderboards = async ({ db }, { showBest, limit }) => {
  const fields = [
    {
      key: 'winPercent',
      field: 'stats.won',
      completed: 25,
    },
    {
      key: 'wins',
      field: 'games.won',
      completed: 0,
    },
  ];

  const { field, completed } = fields.find(({ key }) => key === showBest);

  const games = await db
    .collection('users')
    .find(
      { 'games.completed': { $gte: completed }, [field]: { $gt: 0 } },
      { projection: { _id: 0, name: 1, [field]: 1 } }
    )
    .limit(limit)
    .sort({ [field]: -1 })
    .toArray();

  return games;
};
