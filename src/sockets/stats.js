import {
  getUserStats,
  getGlobalStats,
  getGameLeaderboards,
  getPlayers,
  getUserLeaderboards,
} from '@/db/stats';
import { getUsers } from '@/db/user';
import {
  formatStats,
  formatEmptyStats,
  formatLeaderboardGames,
} from './format';

export const getUsersGamesPlayed = async ({ socket, db }, uid) => {
  try {
    const userStats = await getUserStats(db, uid);
    const userCounts = userStats ? userStats.games.completed : 0;

    socket.emit('setUserGamesPlayed', userCounts);
  } catch (error) {
    console.log({ error });
  }
};

export const getGlobalGamesPlayed = async ({ io, db }) => {
  try {
    const { games } = await getGlobalStats(db);

    io.emit('setGlobalGamesPlayed', games.completed);
  } catch (error) {
    console.log({ error });
  }
};

export const getPlayerCount = async ({ io, db }) => {
  try {
    const players = await getPlayers(db);

    io.emit('setPlayerCount', players);
  } catch (error) {
    console.log({ error });
  }
};

export const getStats = async ({ socket, db }, uid) => {
  try {
    const [user, global] = await Promise.all([
      getUserStats(db, uid),
      getGlobalStats(db),
    ]);

    const userStats = user ? formatStats(user) : formatEmptyStats();
    const globalStats = formatStats(global);

    socket.emit('setStats', { userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const getLeaderboards = async ({ socket, db }, params) => {
  const { showBest } = params;

  const query = {
    moves: () => getGameLeaderboards(db, params),
    time: () => getGameLeaderboards(db, params),
    winPercent: () => getUserLeaderboards(db, params),
    wins: () => getUserLeaderboards(db, params),
  };

  try {
    const games = await query[showBest]();

    const uids = [...new Set(games.map(({ uid }) => uid))];
    const players = await getUsers(db, uids);

    const results = formatLeaderboardGames(games, players, params);

    socket.emit('setLeaderboards', results);
  } catch (error) {
    console.log({ error });
  }
};
