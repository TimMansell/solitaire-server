import { WebSocketServer } from 'ws';
import queryString from 'query-string';
import { newGlobal } from '../global';
import { newUser } from '../user';

const formatMsg = ({ name, payload }) => JSON.stringify({ name, payload });

const getQueryParams = (url) => {
  const { query } = queryString.parseUrl(url, { parseBooleans: true });

  return query;
};

export const setupSockets = (server) => new WebSocketServer({ server });

export const initSockets = (sockets) => {
  const global = newGlobal(sockets);

  global.on('message', (message) => {
    const msg = formatMsg(message);

    sockets.clients.forEach((client) => {
      client.send(msg);
    });
  });

  sockets.on('connection', (ws, req) => {
    const params = getQueryParams(req.url);
    const user = newUser(params);

    user.on('message', (message) => ws.send(formatMsg(message)));
    ws.on('message', (message) => user.sendMessage(message));

    ws.on('close', () => {
      global.updateOnlineCount();

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    global.updateOnlineCount();

    console.log('Client connected.');
  });
};
