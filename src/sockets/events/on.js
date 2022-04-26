import { saveGame } from '#@/db/game';
import { emitOnlineCount } from '../emit/players';
import { emitNewGame } from '../emit/game';
import { emitStats, emitLeaderboards } from '../emit/stats';
import { emitUserGames } from '../emit/user';

export const onSaveGame = async (core, params) => {
  const { queryDb } = core;

  try {
    await queryDb(saveGame, params);

    emitNewGame(core);
  } catch (error) {
    console.log({ error });
  }
};

export const onUserGames = (core, params) => emitUserGames(core, params);

export const onStats = (core) => emitStats(core);

export const onLeaderboards = (core, params) => emitLeaderboards(core, params);

export const onDisconnected = ({ globalEmit, ...core }) => {
  emitOnlineCount({ ...core, emit: globalEmit });

  console.log('Client disconnected.');
};
