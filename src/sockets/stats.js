import { getUserStats, getGlobalStats, getLeaderboard } from '@/db/stats';

import {
  formatStats,
  formatEmptyStats,
  formatLeaderboardGames,
} from './format';

export const getUsersGamesPlayed = async ({ socket, db }, uid) => {
  try {
    const userStats = await getUserStats(db, uid);
    const userCounts = userStats ? userStats.completed : 0;

    socket.emit('setUserGamesPlayed', userCounts);
  } catch (error) {
    console.log({ error });
  }
};

export const getGlobalGamesPlayed = async ({ io, db }) => {
  try {
    const globalStats = await getGlobalStats(db);

    io.emit('setGlobalGamesPlayed', globalStats.completed);
  } catch (error) {
    console.log({ error });
  }
};

export const getPlayerCount = async ({ io, db }) => {
  try {
    const { players } = await getGlobalStats(db);

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

export const getLeaderboards = async ({ socket, db }, { showBest, limit }) => {
  try {
    const [games, players] = await getLeaderboard(db, showBest, limit);

    const formattedGames = formatLeaderboardGames(games, players, showBest);

    socket.emit('setLeaderboards', formattedGames);
  } catch (error) {
    console.log({ error });
  }
};
