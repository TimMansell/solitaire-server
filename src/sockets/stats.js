import {
  getUserGameCount,
  getUserStats,
  getGlobalGameCount,
  getGlobalStats,
  getGameLeaderboards,
  getUserLeaderboards,
} from '#@/db/stats';
import { getUsers } from '#@/db/user';
import {
  formatStats,
  formatEmptyStats,
  formatLeaderboardGames,
} from './format';

export const setUserPlayed = async ({ socket, db, uid }) => {
  try {
    const gameCount = await getUserGameCount(db, uid);

    socket.emit('userPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const setGlobalPlayed = async ({ socket, db }) => {
  try {
    const gameCount = await getGlobalGameCount(db);

    socket.emit('globalPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const setStats = async ({ socket, db, uid }) => {
  try {
    const [user, global] = await Promise.all([
      getUserStats(db, uid),
      getGlobalStats(db),
    ]);

    const userStats = user ? formatStats(user) : formatEmptyStats();
    const globalStats = formatStats(global);

    socket.emit('stats', { userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const setLeaderboards = async ({ socket, db }, params) => {
  const { showBest } = params;

  const queries = [
    {
      key: 'moves',
      query: () => getGameLeaderboards(db, params),
    },
    {
      key: 'time',
      query: () => getGameLeaderboards(db, params),
    },
    {
      key: 'winPercent',
      query: () => getUserLeaderboards(db, params),
    },
    {
      key: 'wins',
      query: () => getUserLeaderboards(db, params),
    },
  ];

  try {
    const { query } = queries.find(({ key }) => key === showBest);
    const games = await query();

    const uids = [...new Set(games.map(({ uid }) => uid))];
    const players = await getUsers(db, uids);

    const results = formatLeaderboardGames(games, players, params);

    socket.emit('leaderboards', results);
  } catch (error) {
    console.log({ error });
  }
};
