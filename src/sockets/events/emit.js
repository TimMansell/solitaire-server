import { emitInitalGame } from '../emit/game';
import { emitUser } from '../emit/user';
import { emitUserPlayed, emitGlobalPlayed } from '../emit/stats';
import { emitPlayerCount, emitOnlineCount } from '../emit/players';

// eslint-disable-next-line import/prefer-default-export
export const setupBroadcast = async ({ globalEmit, ...core }) => {
  emitOnlineCount({ ...core, emit: globalEmit });
  emitUser(core);
  emitPlayerCount(core);
  emitUserPlayed(core);
  emitGlobalPlayed(core);
  emitInitalGame(core);
};
