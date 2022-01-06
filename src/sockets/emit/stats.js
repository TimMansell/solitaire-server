import { getUserStats, getGlobalStats, getLeaderboards } from '@/db/stats';
import { formatStats, formatEmptyStats } from '@/services/stats';

export const emitCounts = async ({ socket, io, db, uid }) => {
  try {
    const [user, global] = await Promise.all([
      getUserStats(db, uid),
      getGlobalStats(db),
    ]);

    const userCounts = user ?? 0;
    const globalCounts = global;

    socket.emit('getUserCounts', userCounts);
    io.emit('getGlobalCounts', globalCounts);
  } catch (error) {
    console.log({ error });
  }
};

export const emitGetStats = async ({ socket, db, uid }) => {
  try {
    const [user, global] = await Promise.all([
      getUserStats(db, uid),
      getGlobalStats(db),
    ]);

    const userStats = user ? formatStats(user) : formatEmptyStats();
    const globalStats = formatStats(global);

    socket.emit('getStats', { userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const emitGetLeaderboards = async ({ socket, db, showBest, limit }) => {
  try {
    const games = await getLeaderboards(db, showBest, limit);

    socket.emit('getLeaderboards', games);
  } catch (error) {
    console.log({ error });
  }
};
