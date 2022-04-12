import { saveGame } from '#@/db/game';
import { emitOnlineCount } from '../emit/players';
import { emitNewGame } from '../emit/game';
import { emitStats, emitLeaderboards } from '../emit/stats';
import { emitUserGames } from '../emit/user';

export const onSaveGame = async (core, game) => {
  try {
    await saveGame(core, game);

    emitNewGame(core);
  } catch (error) {
    console.log({ error });
  }
};

export const onUserGames = (core, params) => emitUserGames(core, params);

export const onStats = (core) => emitStats(core);

export const onLeaderboards = (core, params) => emitLeaderboards(core, params);

export const onDisconnected = ({ socket, uid, ...core }) => {
  socket.removeAllListeners();

  emitOnlineCount(core);

  console.log('Client disconnected.', uid);
};
