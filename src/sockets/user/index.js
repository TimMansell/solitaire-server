import EventEmitter from 'eventemitter3';
import queryString from 'query-string';

import { emitInitalGame, emitNewGame } from '../emit/game';
import { emitUser } from '../emit/user';
import { emitStats, emitUserPlayed, emitGlobalPlayed } from '../emit/stats';
import { emitPlayerCount } from '../emit/players';
import { saveGame } from '#query/db';

// eslint-disable-next-line import/prefer-default-export
export const newUser = (req) => {
  const userEmitter = new EventEmitter();
  const [_, queryParams] = req?.url?.split('?');
  const params = queryString.parse(queryParams);

  return {
    init: async () => {
      try {
        const [game, user, userPlayed] = await Promise.all(
          [emitInitalGame(params), emitUser(params), emitUserPlayed(params)]
          // emitPlayerCount(params),
          // emitGlobalPlayed(params)
        );

        userEmitter.emit('newGame', game);
        userEmitter.emit('user', user);
        userEmitter.emit('userPlayed', userPlayed);
      } catch (error) {
        console.log({ error });
      }
    },
    on: (event, cb) => userEmitter.on(event, cb),
    saveGame: async (payload) => {
      try {
        await saveGame({ ...payload, ...params });

        const game = await emitNewGame(params);

        userEmitter.emit('newGame', game);
      } catch (error) {
        console.log({ error });
      }
    },
    played: async (uid) => {
      if (params.uid !== uid) return;

      try {
        const played = await emitUserPlayed(params);

        userEmitter.emit('userPlayed', played);
      } catch (error) {
        console.log({ error });
      }
    },
    stats: async () => {
      try {
        const stats = await emitStats(params);

        userEmitter.emit('stats', stats);
      } catch (error) {
        console.log({ error });
      }
    },
  };
};

//   emitUser(core);
//   emitPlayerCount(core);
//   emitUserPlayed(core);
//   emitGlobalPlayed(core);
//   emitInitalGame(core);
