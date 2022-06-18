import { WebSocketServer } from 'ws';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {
  createGlobalSend,
  createSend,
  getParams,
  checkIsUser,
  getMessage,
  updateGlobalPlayed,
  updateOnlineCount,
  updatePlayerCount,
  updateUserPlayed,
  checkVersion,
} from './socket';
import { emitter } from '../eventEmitter';

export const setupSockets = (server) =>
  new WebSocketServer({ noServer: true, maxPayload: 512 * 1024 });

export const initSockets = (wss, server) => {
  const sendAllMessage = createGlobalSend(wss);

  emitter.on('newGame', () => sendAllMessage(updateGlobalPlayed));
  emitter.on('newUser', () => sendAllMessage(updatePlayerCount));
  emitter.on('updateOnline', () => sendAllMessage(updateOnlineCount(wss)));

  server.on('upgrade', async function upgrade(request, socket, head) {
    console.log(request.headers);

    const cookies = cookie.parse(request.headers.cookie);

    console.log({ cookies });

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SALT);
      console.log({ decoded });

      console.log('Session is parsed!');

      wss.handleUpgrade(request, socket, head, (ws) => {
        ws.emit('connection', ws, request);
      });
    } catch (err) {
      console.log('invalid token!');
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  wss.on('connection', async (ws, req) => {
    const params = getParams(req);
    const sendMessage = createSend(ws, params);

    const newGame = (uid) => {
      const isUser = checkIsUser(uid, params);

      if (!isUser) return;

      sendMessage(updateUserPlayed);
    };

    const newVersion = (appVersion) => sendMessage(checkVersion(appVersion));

    emitter.on('newGame', newGame);
    emitter.on('newVersion', newVersion);

    ws.on('message', (message) => {
      const responseMessage = getMessage(message);

      if (!responseMessage) return;

      sendMessage(responseMessage);
    });

    ws.on('close', () => {
      emitter.emit('updateOnline');

      emitter.removeListener('newGame', newGame);
      emitter.removeListener('newVersion', newVersion);

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    emitter.emit('updateOnline');

    console.log('Client connected.');
  });
};
