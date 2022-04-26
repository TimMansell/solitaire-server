import {
  getUserGameCount,
  getGlobalGameCount,
  getStats,
  getLeaderboards,
} from '#db/stats';

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

export const emitStats = async ({ emit, queryDb }) => {
  try {
    const [userStats, globalStats] = await queryDb(getStats);

    emit('stats', { userStats, globalStats });
  } catch (error) {
    console.log({ error });
  }
};

export const emitLeaderboards = async ({ emit, queryDb }, params) => {
  try {
    const leaderboards = await queryDb(getLeaderboards, params);

    emit('leaderboards', leaderboards);
  } catch (error) {
    console.log({ error });
  }
};
