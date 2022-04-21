import { saveGame } from '#@/db/game';
import { emitOnlineCount } from '../emit/players';
import { emitNewGame } from '../emit/game';
import { emitStats, emitLeaderboards } from '../emit/stats';
import { emitUserGames } from '../emit/user';

export const onSaveGame = async (core, params) => {
  const { query } = core;

  try {
    await query(saveGame, params);

    emitNewGame(core);
  } catch (error) {
    console.log({ error });
  }
};

export const onUserGames = async (core, params) =>
  emitUserGames({ ...core, params });

export const onStats = async (core) => emitStats(core);

export const onLeaderboards = async (core, params) =>
  emitLeaderboards({ ...core, params });

export const onDisconnected = async ({ globalEmit, ...core }) => {
  emitOnlineCount({ ...core, emit: globalEmit });

  console.log('Client disconnected.');
};
