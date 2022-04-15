import { saveGame } from '#@/db/game';
import { emitOnlineCount } from '../emit/players';
import { emitNewGame } from '../emit/game';
import { emitStats, emitLeaderboards } from '../emit/stats';
import { emitUserGames } from '../emit/user';

export const onSaveGame = ({ socket, ...core }) =>
  socket.on('saveGame', async (game) => {
    try {
      await saveGame(core, game);

      emitNewGame({ socket, ...core });
    } catch (error) {
      console.log({ error });
    }
  });

export const onUserGames = ({ socket, ...core }) =>
  socket.on('userGames', (params) =>
    emitUserGames({ socket, ...core }, params)
  );

export const onStats = ({ socket, ...core }) =>
  socket.on('stats', () => emitStats({ socket, ...core }));

export const onLeaderboards = ({ socket, ...core }) =>
  socket.on('leaderboards', (params) =>
    emitLeaderboards({ socket, ...core }, params)
  );

export const onDisconnected = ({ socket, uid, ...core }) =>
  socket.on('disconnect', () => {
    socket.removeAllListeners();

    emitOnlineCount(core);

    console.log('Client disconnected.', uid);
  });
