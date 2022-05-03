import EventEmitter from 'eventemitter3';
import queryString from 'query-string';

import { emitter } from '../../setup';
import { emitNewUpdate } from '../emit/app';
import { emitInitalGame, emitNewGame } from '../emit/game';
import { emitUser, emitUserGames } from '../emit/user';
import {
  emitStats,
  emitUserPlayed,
  emitLeaderboards,
  emitGlobalPlayed,
} from '../emit/stats';
import { emitPlayerCount } from '../emit/players';
import { saveGame } from '#query/db';

// eslint-disable-next-line import/prefer-default-export
export const newUser = (req) => {
  const userEmitter = new EventEmitter();
  const [_, queryParams] = req?.url?.split('?');
  const params = queryString.parse(queryParams);

  emitter.on('newGame', async (uid) => {
    if (params.uid !== uid) return;

    try {
      const played = await emitUserPlayed(params);

      userEmitter.emit('user.played', played);
    } catch (error) {
      console.log({ error });
    }
  });

  emitter.on('newVersion', (appVersion) => {
    const isOutdated = emitNewUpdate({ ...params, appVersion });

    userEmitter.emit('user.version', isOutdated);
  });

  return {
    on: (event, cb) => userEmitter.on(event, cb),
    init: async () => {
      try {
        const [game, user, userPlayed, playerCount, globalPlayers] =
          await Promise.all([
            emitInitalGame(params),
            emitUser(params),
            emitUserPlayed(params),
            emitPlayerCount(),
            emitGlobalPlayed(),
          ]);

        userEmitter.emit('user.newGame', game);
        userEmitter.emit('user.profile', user);
        userEmitter.emit('user.played', userPlayed);
        userEmitter.emit('user.players', playerCount);
        userEmitter.emit('user.globalPlayers', globalPlayers);
      } catch (error) {
        console.log({ error });
      }
    },
    saveGame: async (payload) => {
      try {
        await saveGame({ ...payload, ...params });

        const game = await emitNewGame(params);

        userEmitter.emit('user.newGame', game);
      } catch (error) {
        console.log({ error });
      }
    },
    userGames: async (payload) => {
      try {
        const games = await emitUserGames({ ...payload, ...params });

        userEmitter.emit('user.games', games);
      } catch (error) {
        console.log({ error });
      }
    },
    leaderboards: async (payload) => {
      try {
        const leaderboards = await emitLeaderboards({ ...payload });

        userEmitter.emit('user.leaderboards', leaderboards);
      } catch (error) {
        console.log({ error });
      }
    },
    stats: async () => {
      try {
        const stats = await emitStats(params);

        userEmitter.emit('user.stats', stats);
      } catch (error) {
        console.log({ error });
      }
    },
  };
};
