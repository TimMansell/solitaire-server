import { getUserStats, getGlobalStats, getLeaderboard } from '@/db/stats';

import {
  formatStats,
  formatEmptyStats,
  formatLeaderboardGames,
} from './format';

export const getGamesPlayed = async ({ socket, io, db }, uid) => {
  try {
    const [user, global] = await Promise.all([
      getUserStats(db, uid),
      getGlobalStats(db),
    ]);

    const userCounts = user ? user.completed : 0;
    const globalCounts = global.completed;

    socket.emit('setUserGamesPlayed', userCounts);
    io.emit('setGlobalGamesPlayed', globalCounts);
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
