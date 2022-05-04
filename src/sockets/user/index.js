import EventEmitter from 'eventemitter3';
import queryString from 'query-string';

import { emitNewUpdate } from '../emit/app';
import { emitInitalGame, emitSaveGame } from '../emit/game';
import { emitUser, emitUserGames } from '../emit/user';
import {
  emitStats,
  emitUserPlayed,
  emitLeaderboards,
  emitGlobalPlayed,
} from '../emit/stats';
import { emitPlayerCount } from '../emit/players';
import { dbEmitter } from '#db/setup';

// eslint-disable-next-line import/prefer-default-export
export const newUser = (req) => {
  const emitter = new EventEmitter();
  const [_, queryParams] = req?.url?.split('?');
  const params = queryString.parse(queryParams);

  const emit = (name, payload) => emitter.emit('message', { name, payload });

  dbEmitter.on('db.newGame', async (uid) => {
    if (params.uid !== uid) return;

    try {
      const played = await emitUserPlayed(params);

      emit('userPlayed', played);
    } catch (error) {
      console.log({ error });
    }
  });

  dbEmitter.on('db.newVersion', (appVersion) => {
    const isOutdated = emitNewUpdate({ ...params, appVersion });

    emit('newUpdate', isOutdated);
  });

  const init = async () => {
    try {
      const [game, user, userPlayed, playerCount, globalPlayers] =
        await Promise.all([
          emitInitalGame(params),
          emitUser(params),
          emitUserPlayed(params),
          emitPlayerCount(),
          emitGlobalPlayed(),
        ]);

      emit('newGame', game);
      emit('user', user);
      emit('userPlayed', userPlayed);
      emit('playerCount', playerCount);
      emit('globalPlayed', globalPlayers);
    } catch (error) {
      console.log({ error });
    }
  };

  const messages = [
    {
      key: 'saveGame',
      messageName: 'newGame',
      query: (payload) => emitSaveGame({ ...payload, ...params }),
    },
    {
      key: 'userGames',
      messageName: 'userGames',
      query: (payload) => emitUserGames({ ...payload, ...params }),
    },
    {
      key: 'stats',
      messageName: 'stats',
      query: (payload) => emitStats({ ...payload, ...params }),
    },
    {
      key: 'leaderboards',
      messageName: 'leaderboards',
      query: (payload) => emitLeaderboards({ ...payload, ...params }),
    },
  ];

  init();

  return {
    on: (event, cb) => emitter.on(event, cb),
    message: async (message) => {
      try {
        const { name, payload } = JSON.parse(message);

        const messageToUse = messages.find(({ key }) => key === name);

        if (!messageToUse) throw new Error('Invalid message name');

        const result = await messageToUse.query(payload);

        emit(messageToUse.messageName, result);
      } catch (error) {
        console.log({ error });
      }
    },
  };
};
