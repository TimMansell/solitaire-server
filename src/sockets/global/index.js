import EventEmitter from 'eventemitter3';
import { emitGlobalPlayed } from '../emit/stats';
import { emitPlayerCount } from '../emit/players';
import { dbEmitter } from '#db/setup';

// eslint-disable-next-line import/prefer-default-export
export const newGlobal = (sockets) => {
  const emitter = new EventEmitter();

  const emit = (name, payload) => emitter.emit('message', { name, payload });

  dbEmitter.on('db.newGame', async () => {
    try {
      const played = await emitGlobalPlayed();

      emit('globalPlayed', played);
    } catch (error) {
      console.log({ error });
    }
  });

  dbEmitter.on('db.newUser', async () => {
    try {
      const players = await emitPlayerCount();

      emit('playerCount', players);
    } catch (error) {
      console.log({ error });
    }
  });

  return {
    on: (message, callback) => emitter.on(message, callback),
    setOnlineCount: () => {
      const onlineCount = [...sockets.clients].length;

      emit('onlineCount', onlineCount);
    },
  };
};
