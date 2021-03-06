import {
  setupPing,
  sendPing,
  createGlobalSend,
  createSend,
  getParams,
  checkIsUser,
  getMessage,
  initUser,
  updateGlobalPlayed,
  updateOnlineCount,
  updatePlayerCount,
  updateUserPlayed,
  checkVersionUpdate,
  checkVersion,
} from './helpers';
import { emitter } from '#src/eventEmitter';
import { isTest } from '#src/main';

export const initV1Socket = ({ v1: wss }) => {
  const sendAllMessage = createGlobalSend(wss);

  const pingInterval = setupPing();

  emitter.on('newGame', () => sendAllMessage(updateGlobalPlayed));
  emitter.on('newUser', () => sendAllMessage(updatePlayerCount));
  emitter.on('updateOnline', () => sendAllMessage(updateOnlineCount));

  wss.on('connection', async (ws, query) => {
    const sendMessage = createSend(ws, query);

    const ping = () => sendPing(ws);

    const newGame = (uid) => {
      const isUser = checkIsUser(uid, query);

      if (!isUser) return;

      sendMessage(updateUserPlayed);
    };

    const newVersion = (appVersion) =>
      sendMessage(checkVersionUpdate, { appVersion });

    emitter.on('ping', ping);
    emitter.on('newGame', newGame);
    emitter.on('newVersion', newVersion);

    ws.on('message', (message) => {
      const responseMessage = getMessage(message);

      if (!responseMessage) return;

      sendMessage(responseMessage);
    });

    ws.on('close', () => {
      emitter.emit('updateOnline');

      emitter.off('newGame', newGame);
      emitter.off('newVersion', newVersion);
      emitter.off('ping', ping);

      console.log('Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    sendMessage(initUser);
    sendMessage(updateUserPlayed);
    sendMessage(updatePlayerCount);
    sendMessage(updateGlobalPlayed);
    sendMessage(checkVersion);

    emitter.emit('updateOnline');

    console.log('Client connected.');
  });

  wss.on('close', () => clearInterval(pingInterval));
};

export const initTestSocket = ({ test: wss }) => {
  wss.on('connection', async (ws) => {
    const sendMessage = createSend(ws);

    ws.on('message', (message) => {
      const responseMessage = getMessage(message);

      if (!responseMessage) return;

      sendMessage(responseMessage);
    });

    ws.on('close', () => {
      console.log('Test Client Disconnected.');
    });

    ws.on('error', () => {
      console.log('Some Error occurred.');
    });

    console.log('Test Client connected.');
  });
};

export const upgradeSocket = (wss) => {
  const paths = Object.entries(wss)
    .filter(([name]) => isTest || name !== 'test')
    .reduce(
      (accumulator, [key, value]) => ({ ...accumulator, [`/${key}`]: value }),
      {}
    );

  return (request, socket, head) => {
    const { query, url } = getParams(request);

    const [path, socketToUse] =
      Object.entries(paths).find(([key]) => key === url) || [];

    if (!path) {
      socket.destroy();
      return;
    }

    socketToUse.handleUpgrade(request, socket, head, (ws) =>
      socketToUse.emit('connection', ws, query)
    );
  };
};
