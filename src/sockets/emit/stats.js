import {
  getUserGameCount,
  getGlobalGameCount,
  getStats,
  getLeaderboards,
} from '#db/stats';

export const emitUserPlayed = async (params) => {
  try {
    const gameCount = await getUserGameCount(params);

    return gameCount;
  } catch (error) {
    console.log({ error });
  }
};

export const emitGlobalPlayed = async () => {
  try {
    const gameCount = await getGlobalGameCount();

    return gameCount;
  } catch (error) {
    console.log({ error });
  }
};

export const emitStats = async (params) => {
  try {
    const [userStats, globalStats] = await getStats(params);

    return { userStats, globalStats };
  } catch (error) {
    console.log({ error });
  }
};

export const emitLeaderboards = async (params) => {
  try {
    const leaderboards = await getLeaderboards(params);

    return leaderboards;
  } catch (error) {
    console.log({ error });
  }
};
