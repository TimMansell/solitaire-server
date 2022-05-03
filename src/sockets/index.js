import { emitter } from '../setup';
import { newUser } from './user';
import { emitGlobalPlayed } from './emit/stats';

const formatMsg = (name, payload) => JSON.stringify({ name, payload });

// eslint-disable-next-line import/prefer-default-export
export const initSockets = (sockets) => {
  emitter.on('gamesUpdate', async () => {
    const result = await emitGlobalPlayed();
    const msg = formatMsg('globalPlayed', result);

    sockets.clients.forEach((client) => {
      client.send(msg);
    });
  });

  emitter.on('updateOnlineCount', () => {
    const onlineCount = [...sockets.clients].length;
    const msg = formatMsg('onlineCount', onlineCount);

    sockets.clients.forEach((client) => {
      client.send(msg);
    });
  });

  sockets.on('connection', (ws, req) => {
    const user = newUser(req);
    const send = (name, payload) => ws.send(formatMsg(name, payload));

    emitter.on('gamesUpdate', (uid) => {
      user.played(uid);
    });

    ws.on('message', (data) => {
      const { name, payload } = JSON.parse(data);
      const messages = {
        stats: () => user.stats(),
        saveGame: () => user.saveGame(payload),
      };

      const [_, message] = Object.entries(messages).find(
        ([key]) => key === name
      );

      message();
    });

    ws.on('close', () => {
      emitter.emit('updateOnlineCount');

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    user.on('newGame', (payload) => send('newGame', payload));
    user.on('user', (payload) => send('user', payload));
    user.on('stats', (payload) => send('stats', payload));
    user.on('userPlayed', (payload) => send('userPlayed', payload));

    user.init();

    emitter.emit('updateOnlineCount');

    console.log('Client connected.');
  });
};
