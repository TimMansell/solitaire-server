// import { onUsersUpdate, onVersionUpdate, onGamesUpdate } from '../events/watch';
import { emitInitalGame } from '../emit/game';
import { emitStats, emitLeaderboards } from '../emit/stats';

// export const setupWatchEvents = (core) => {
//   onUsersUpdate(core);
//   onVersionUpdate(core);
//   onGamesUpdate(core);
// };

export const setupEmitEvents = async (emitter) => {
  emitInitalGame(emitter);
  emitStats(emitter);
  emitLeaderboards(emitter);
};
