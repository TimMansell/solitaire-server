import {
  getGameCountByUid,
  getGlobalGameCount,
  getUserCount,
  getStats,
  getLeaderboards,
} from '#db/stats';

export const getUserPlayed = async (params) => {
  try {
    const gameCount = await getGameCountByUid(params);

    return ['userPlayed', gameCount];
  } catch (error) {
    console.log({ error });
  }
};

export const getGlobalPlayed = async () => {
  try {
    const gameCount = await getGlobalGameCount();

    return ['globalPlayed', gameCount];
  } catch (error) {
    console.log({ error });
  }
};

export const getPlayerCount = async () => {
  try {
    const players = await getUserCount();

    return ['playerCount', players];
  } catch (error) {
    console.log({ error });
  }
};

export const getOnlinePlayerCount = async (sockets) => [
  'onlineCount',
  [...sockets.clients].length,
];

export const stats = async (params) => {
  try {
    const [userStats, globalStats] = await getStats(params);

    return ['stats', { userStats, globalStats }];
  } catch (error) {
    console.log({ error });
  }
};

export const leaderboards = async (params) => {
  try {
    const leaderboard = await getLeaderboards(params);

    return ['leaderboards', leaderboard];
  } catch (error) {
    console.log({ error });
  }
};
