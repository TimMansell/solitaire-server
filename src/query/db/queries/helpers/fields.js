export const getStatsFields = () => [
  {
    $group: {
      _id: null,
      completed: { $count: {} },
      won: { $sum: { $toInt: '$won' } },
      lost: { $sum: { $toInt: '$lost' } },
      quit: {
        $sum: {
          $toInt: { $and: [{ $not: '$won' }, { $not: '$lost' }] },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      completed: 1,
      won: 1,
      lost: 1,
      quit: 1,
      wonPercent: {
        $divide: ['$won', '$completed'],
      },
      lostPercent: {
        $divide: ['$lost', '$completed'],
      },
      quitPercent: {
        $divide: ['$quit', '$completed'],
      },
    },
  },
];

export const getLeaderboardFields = (showBest) => {
  const fields = [
    {
      key: 'moves',
      matches: [{ $match: { won: true } }],
      sortBy: { moves: 1 },
      lookupField: 'uid',
      project: { moves: 1, date: 1 },
    },
    {
      key: 'time',
      matches: [{ $match: { won: true, time: { $gt: 0 } } }],
      sortBy: { time: 1 },
      lookupField: 'uid',
      project: { time: 1, date: 1 },
    },
    {
      key: 'winPercent',
      matches: [
        {
          $group: {
            _id: '$uid',
            completed: { $count: {} },
            won: { $sum: { $toInt: '$won' } },
          },
        },
        {
          $project: {
            completed: 1,
            won: 1,
            wonPercent: {
              $divide: ['$won', '$completed'],
            },
          },
        },
        { $match: { completed: { $gte: 25 }, won: { $gt: 0 } } },
      ],
      sortBy: { wonPercent: -1 },
      lookupField: '_id',
      project: { wonPercent: 1 },
    },
    {
      key: 'wins',
      matches: [
        {
          $group: {
            _id: '$uid',
            won: { $sum: { $toInt: '$won' } },
          },
        },
        { $match: { won: { $gt: 0 } } },
      ],
      sortBy: { won: -1 },
      lookupField: '_id',
      project: { won: 1 },
    },
  ];

  const [defaultQuery] = fields;

  const queryToUse = fields.find(({ key }) => key === showBest) || defaultQuery;

  return queryToUse;
};
