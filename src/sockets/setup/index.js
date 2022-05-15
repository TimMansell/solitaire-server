import { WebSocketServer } from 'ws';
import queryString from 'query-string';
import { globalEmitter, userEmitter } from '../emit';

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
    const connection = userEmitter(query);

    ws.on('message', (message) => connection.runMessage(message));

    ws.on('close', () => {
      global.updateOnlineCount(sockets);

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    connection.on('sendMessage', (message) => ws.send(message));

    connection.init();
    global.updateOnlineCount(sockets);

    console.log('Client connected.');
  });
};
