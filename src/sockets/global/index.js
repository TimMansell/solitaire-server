import EventEmitter from 'eventemitter3';
import { emitter } from '../../setup';

import { emitGlobalPlayed } from '../emit/stats';
import { emitPlayerCount } from '../emit/players';

// eslint-disable-next-line import/prefer-default-export
export const newGlobal = (sockets) => {
  const globalEmitter = new EventEmitter();

  emitter.on('newGame', async () => {
    try {
      const played = await emitGlobalPlayed();

      globalEmitter.emit('global.played', played);
    } catch (error) {
      console.log({ error });
    }
  });

  emitter.on('newUser', async () => {
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
