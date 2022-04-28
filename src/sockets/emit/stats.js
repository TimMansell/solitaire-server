import { getUserGameCount, getGlobalGameCount } from '#query/db';

export const emitUserPlayed = async ({ emit, queryDb }) => {
  try {
    const gameCount = await queryDb(getUserGameCount);

    emit('userPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const emitGlobalPlayed = async ({ emit, queryDb }) => {
  try {
    const gameCount = await queryDb(getGlobalGameCount);

    emit('globalPlayed', gameCount);
  } catch (error) {
    console.log({ error });
  }
};

export const emitStats = (emitter) => {
  emitter.on('stats', async (db) => {
    try {
      const [userStats, globalStats] = await db.getStats();

      emitter.emit('emit', 'stats', { userStats, globalStats });
    } catch (error) {
      console.log({ error });
    }
  });
};

export const emitLeaderboards = (emitter) => {
  emitter.on('leaderboards', async (db, params) => {
    try {
      const leaderboards = await db.getLeaderboards(params);

      emitter.emit('emit', 'leaderboards', leaderboards);
    } catch (error) {
      console.log({ error });
    }
  });
};
