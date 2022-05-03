import EventEmitter from 'eventemitter3';
import { emitGlobalPlayed } from '../emit/stats';
import { emitPlayerCount } from '../emit/players';
import { dbEmitter } from '#db/setup';

// eslint-disable-next-line import/prefer-default-export
export const newGlobal = (sockets) => {
  const globalEmitter = new EventEmitter();

  dbEmitter.on('newGame', async () => {
    try {
      const played = await emitGlobalPlayed();

      globalEmitter.emit('global.played', played);
    } catch (error) {
      console.log({ error });
    }
  });

  dbEmitter.on('newUser', async () => {
    try {
      const players = await emitPlayerCount();

      globalEmitter.emit('global.players', players);
    } catch (error) {
      console.log({ error });
    }
  });

  return {
    on: (event, cb) => globalEmitter.on(event, cb),
    setOnlineCount: () => {
      const onlineCount = [...sockets.clients].length;

      globalEmitter.emit('global.online', onlineCount);
    },
  };
};
