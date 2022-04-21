export const getStats = async ({ db, uid, filter = false }) => {
  const match = filter ? { uid } : {};

  const [stats] = await db
    .collection('games')
    .aggregate([
      { $match: { ...match } },
      {
        $facet: {
          completed: [{ $match: { completed: true } }, { $count: 'count' }],
          won: [{ $match: { won: true } }, { $count: 'count' }],
          lost: [{ $match: { lost: true } }, { $count: 'count' }],
          quit: [{ $match: { won: false, lost: false } }, { $count: 'count' }],
        },
      },
      {
        $project: {
          completed: {
            $ifNull: ['$completed.count', 0],
          },
          won: {
            $ifNull: ['$won.count', 0],
          },
          lost: {
            $ifNull: ['$lost.count', 0],
          },
          quit: {
            $ifNull: ['$quit.count', 0],
          },
        },
      },
      { $unwind: '$completed' },
      { $unwind: '$won' },
      { $unwind: '$lost' },
      { $unwind: '$quit' },
    ])
    .toArray();

  return stats;
};

export const getPlayers = ({ db }) => db.collection('users').countDocuments({});

export const getOnlinePlayers = ({ io }) => io.engine.clientsCount;

export const getUserGameCount = ({ db, uid }) =>
  db.collection('games').countDocuments({ uid });

export const getGlobalGameCount = ({ db }) =>
  db.collection('games').countDocuments({});

export const getGameLeaderboards = async ({ db, showBest, limit }) => {
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

export const getUserLeaderboards = async ({ db, showBest, limit }) => {
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
