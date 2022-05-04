import { WebSocketServer } from 'ws';
import { newGlobal } from '../global';
import { newUser } from '../user';

const formatMsg = ({ name, payload }) => JSON.stringify({ name, payload });

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
    const user = newUser(req);

    user.on('message', (message) => ws.send(formatMsg(message)));
    ws.on('message', (message) => user.message(message));

    ws.on('close', () => {
      global.setOnlineCount();

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    global.setOnlineCount();

    console.log('Client connected.');
  });
};
