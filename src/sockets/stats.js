import {
  getUserGameCount,
  getGlobalGameCount,
  getStats,
  getGameLeaderboards,
  getUserLeaderboards,
} from '#@/db/stats';
import { formatStats, formatLeaderboardGames } from './format';

export const setUserPlayed = async ({ socket, ...core }) => {
  try {
    const gameCount = await getUserGameCount(core);

    socket.emit('userPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const setGlobalPlayed = async ({ socket, ...core }) => {
  try {
    const gameCount = await getGlobalGameCount(core);

    socket.emit('globalPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const setStats = async ({ socket, uid, ...core }) => {
  try {
    const [user, global] = await Promise.all([
      getStats(core, { uid }),
      getStats(core),
    ]);

    const userStats = formatStats(user);
    const globalStats = formatStats(global);

    socket.emit('stats', { userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const setLeaderboards = async ({ socket, ...core }, params) => {
  const { showBest } = params;

  const queries = [
    {
      key: 'moves',
      query: () => getGameLeaderboards(core, params),
    },
    {
      key: 'time',
      query: () => getGameLeaderboards(core, params),
    },
    {
      key: 'winPercent',
      query: () => getUserLeaderboards(core, params),
    },
    {
      key: 'wins',
      query: () => getUserLeaderboards(core, params),
    },
  ];

  try {
    const { query } = queries.find(({ key }) => key === showBest);
    const leaderboards = await query();

    const results = formatLeaderboardGames(leaderboards, params);

    socket.emit('leaderboards', results);
  } catch (error) {
    console.log({ error });
  }
};
