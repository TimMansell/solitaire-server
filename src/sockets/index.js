import { WebSocketServer } from 'ws';
import queryString from 'query-string';
import { globalEmitter, connectionEmitter } from './emit';

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
    const connection = connectionEmitter(query);

    ws.on('message', (message) => connection.runMessage(message));

    ws.on('close', () => {
      global.updateOnlineCount(sockets);

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    connection.on('sendMessage', (message) => ws.send(message));

    global.updateOnlineCount(sockets);

    connection.init();

    console.log('Client connected.');
  });
};
