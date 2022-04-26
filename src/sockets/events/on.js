import { saveGame } from '#@/db/game';
import { emitOnlineCount } from '../emit/players';
import { emitNewGame } from '../emit/game';
import { emitStats, emitLeaderboards } from '../emit/stats';
import { emitUserGames } from '../emit/user';

export const onSaveGame = ({ on, ...core }) =>
  on('saveGame', async (params) => {
    const { queryDb } = core;

    try {
      await queryDb(saveGame, params);

      emitNewGame(core);
    } catch (error) {
      console.log({ error });
    }
  });

export const onUserGames = ({ on, ...core }) =>
  on('userGames', (params) => emitUserGames(core, params));

export const onStats = ({ on, ...core }) => on('stats', () => emitStats(core));

export const onLeaderboards = ({ on, ...core }) =>
  on('leaderboards', (params) => emitLeaderboards(core, params));

export const onDisconnected = ({ on, globalEmit, ...core }) =>
  on('disconnect', () => emitOnlineCount({ ...core, emit: globalEmit }));
