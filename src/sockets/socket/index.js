import {
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
  checkVersion,
} from './helpers';
import { emitter } from '#src/eventEmitter';
import { isTest } from '#src/main';

export const initV1Socket = ({ v1: socket }) => {
  const sendAllMessage = createGlobalSend(socket);

  emitter.on('newGame', () => sendAllMessage(updateGlobalPlayed));
  emitter.on('newUser', () => sendAllMessage(updatePlayerCount));
  emitter.on('updateOnline', () => sendAllMessage(updateOnlineCount));

  socket.on('connection', async (ws, query) => {
    const sendMessage = createSend(ws, query);

    const newGame = (uid) => {
      const isUser = checkIsUser(uid, query);

      if (!isUser) return;

      sendMessage(updateUserPlayed);
    };

    const newVersion = (appVersion) =>
      sendMessage(checkVersion, { appVersion });

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

    sendMessage(initUser);
    sendMessage(updateUserPlayed);
    sendMessage(updatePlayerCount);
    sendMessage(updateGlobalPlayed);

    emitter.emit('updateOnline');

    console.log('Client connected.');
  });
};

export const initTestSocket = ({ test: socket }) => {
  socket.on('connection', async (ws, query) => {
    const sendMessage = createSend(ws, query);

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

export const upgradeSocket = (sockets) => {
  const paths = Object.entries(sockets)
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

    socketToUse.handleUpgrade(request, socket, head, (ws) => {
      socketToUse.emit('connection', ws, query);
    });
  };
};
