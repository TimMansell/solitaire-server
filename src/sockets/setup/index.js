import { WebSocketServer } from 'ws';
import queryString from 'query-string';
import { globalEmitter } from '../global';
import { userEmitter } from '../user';

export const setupSockets = (server) => new WebSocketServer({ server });

export const initSockets = (sockets) => {
  const global = globalEmitter();

  global.on('sendMessage', (payload) =>
    sockets.clients.forEach((client) => client.send(payload))
  );

  sockets.on('connection', (ws, req) => {
    const { query } = queryString.parseUrl(req.url, {
      parseBooleans: true,
    });
    const user = userEmitter(query);

    user.on('sendMessage', (message) => ws.send(message));
    ws.on('message', user.runMessage);

    ws.on('close', () => {
      global.updateOnlineCount(sockets);

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    user.init();
    global.updateOnlineCount(sockets);

    console.log('Client connected.');
  });
};
