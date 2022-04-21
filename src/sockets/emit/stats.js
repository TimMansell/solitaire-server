import {
  getUserGameCount,
  getGlobalGameCount,
  getStats,
  getGameLeaderboards,
  getUserLeaderboards,
} from '#@/db/stats';
import { formatStats, formatLeaderboardGames } from './format';

export const emitUserPlayed = async ({ emit, query }) => {
  try {
    const gameCount = await query(getUserGameCount);

    emit('userPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const emitGlobalPlayed = async ({ emit, query }) => {
  try {
    const gameCount = await query(getGlobalGameCount);

    emit('globalPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const emitStats = async ({ emit, query }) => {
  try {
    const [user, global] = await Promise.all([
      query(getStats, { filter: true }),
      query(getStats),
    ]);

    const userStats = formatStats(user);
    const globalStats = formatStats(global);

    emit('stats', { userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const emitLeaderboards = async ({ emit, query, params }) => {
  console.log({ query });

  const { showBest } = params;

  const queries = [
    {
      key: 'moves',
      query2: () => query(getGameLeaderboards, params),
    },
    {
      key: 'time',
      query2: () => query(getGameLeaderboards, params),
    },
    {
      key: 'winPercent',
      query2: () => query(getUserLeaderboards, params),
    },
    {
      key: 'wins',
      query2: () => query(getUserLeaderboards, params),
    },
  ];

  try {
    const { query2 } = queries.find(({ key }) => key === showBest);
    const leaderboards = await query2();

    const results = formatLeaderboardGames(leaderboards, params);

    emit('leaderboards', results);
  } catch (error) {
    console.log({ error });
  }
};
