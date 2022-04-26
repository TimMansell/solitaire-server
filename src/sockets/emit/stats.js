import {
  getUserGameCount,
  getGlobalGameCount,
  getStats,
  getLeaderboards,
} from '#@/queries/stats';

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
    const [userStats, globalStats] = await query(getStats);

    console.log({ userStats, globalStats });

    emit('stats', { userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const emitLeaderboards = async ({ emit, query, params }) => {
  try {
    const leaderboards = await query(getLeaderboards, params);

    emit('leaderboards', leaderboards);
  } catch (error) {
    console.log({ error });
  }
};
