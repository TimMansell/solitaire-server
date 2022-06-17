import {
  getGameCountByUid,
  getGlobalGameCount,
  getActiveUsers,
  getGameStats,
  getLeaderboard,
} from '#db';

export const getUserPlayed = async (params) => {
  try {
    const gameCount = await getGameCountByUid(params);

    return ['userPlayed', gameCount];
  } catch (error) {
    console.error({ error });

    return [];
  }
};

export const getGlobalPlayed = async () => {
  try {
    const gameCount = await getGlobalGameCount();

    return ['globalPlayed', gameCount];
  } catch (error) {
    console.error({ error });

    return [];
  }
};

export const getPlayerCount = async () => {
  try {
    const players = await getActiveUsers();

    return ['playerCount', players];
  } catch (error) {
    console.error({ error });

    return [];
  }
};

export const getOnlineCount = async ({ sockets }) => [
  'onlineCount',
  [...sockets.clients].length,
];

export const getStats = async (params) => {
  try {
    const [userStats, globalStats] = await getGameStats(params);

    return ['stats', { userStats, globalStats }];
  } catch (error) {
    console.error({ error });

    return [];
  }
};

export const getLeaderboards = async (params) => {
  try {
    const leaderboard = await getLeaderboard(params);

    return ['leaderboards', leaderboard];
  } catch (error) {
    console.error({ error });

    return [];
  }
};
