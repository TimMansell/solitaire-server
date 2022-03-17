import {
  getUserStats,
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

export const getUsersGamesPlayed = async ({ db }, uid, callback) => {
  try {
    const userStats = await getUserStats(db, uid);
    const userCounts = userStats ? userStats.games.completed : 0;

    callback(userCounts);
  } catch (error) {
    console.log({ error });
  }
};

export const getGlobalGamesPlayed = async ({ socket, db }) => {
  try {
    const { games } = await getGlobalStats(db);

    socket.emit('setGlobalGamesPlayed', games.completed);
  } catch (error) {
    console.log({ error });
  }
};

export const getStats = async ({ db }, uid, callback) => {
  try {
    const [user, global] = await Promise.all([
      getUserStats(db, uid),
      getGlobalStats(db),
    ]);

    const userStats = user ? formatStats(user) : formatEmptyStats();
    const globalStats = formatStats(global);

    callback({ userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const getLeaderboards = async ({ db }, params, callback) => {
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

    callback(results);
  } catch (error) {
    console.log({ error });
  }
};
