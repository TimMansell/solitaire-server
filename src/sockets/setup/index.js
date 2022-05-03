import { WebSocketServer } from 'ws';
import { newGlobal } from '../global';
import { newUser } from '../user';

export const setupSockets = (server) => new WebSocketServer({ server });

export const initSockets = (sockets) => {
  const formatMsg = (name, payload) => JSON.stringify({ name, payload });

  const global = newGlobal(sockets);

  global.on('global.played', (played) => {
    const msg = formatMsg('globalPlayed', played);

    sockets.clients.forEach((client) => {
      client.send(msg);
    });
  });

  global.on('global.players', (players) => {
    const msg = formatMsg('playerCount', players);

    sockets.clients.forEach((client) => {
      client.send(msg);
    });
  });

  global.on('global.online', (onlineCount) => {
    const msg = formatMsg('onlineCount', onlineCount);

    sockets.clients.forEach((client) => {
      client.send(msg);
    });
  });

  sockets.on('connection', (ws, req) => {
    const user = newUser(req);
    const send = (name, payload) => ws.send(formatMsg(name, payload));

    ws.on('message', (data) => {
      const { name, payload } = JSON.parse(data);
      const messages = {
        saveGame: () => user.saveGame(payload),
        userGames: () => user.userGames(payload),
        stats: () => user.stats(),
        leaderboards: () => user.leaderboards(payload),
      };

      const [_, message] = Object.entries(messages).find(
        ([key]) => key === name
      );

      message();
    });

    ws.on('close', () => {
      global.setOnlineCount();

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    user.on('user.newGame', (payload) => send('newGame', payload));
    user.on('user.profile', (payload) => send('user', payload));
    user.on('user.games', (payload) => send('userGames', payload));
    user.on('user.leaderboards', (payload) => send('leaderboards', payload));
    user.on('user.stats', (payload) => send('stats', payload));
    user.on('user.played', (payload) => send('userPlayed', payload));
    user.on('user.players', (payload) => send('playerCount', payload));
    user.on('user.globalPlayers', (payload) => send('globalPlayed', payload));
    user.on('user.version', (payload) => send('newUpdate', payload));

    user.init();

    global.setOnlineCount();

    console.log('Client connected.');
  });
};
