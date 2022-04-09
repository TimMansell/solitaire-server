import { watchVersion, watchUsers, watchGames } from '#@/db/watch';
import { emitNewUpdate } from './app';
import { emitPlayerCount } from './players';
import { emitUserPlayed, emitGlobalPlayed } from './stats';
import { emitCreateUser } from './user';
import { emitNewGame } from './game';

export const watchForVersionUpdate = ({ io, ...core }) =>
  watchVersion(core).on(
    'change',
    async ({
      updateDescription: {
        updatedFields: { appVersion },
      },
    }) => {
      const sockets = await io.fetchSockets();

      if (!appVersion) return;

      sockets.forEach((socket) => emitNewUpdate({ socket, appVersion }));
    }
  );

export const watchForUsersUpdate = ({ io, ...core }) =>
  watchUsers(core).on('change', () => emitPlayerCount({ ...core, socket: io }));

export const watchForGamesUpdate = ({ io, ...core }) =>
  watchGames(core).on('change', async ({ fullDocument: { uid } }) => {
    const sockets = await io.fetchSockets();
    const socket = sockets.find(({ handshake }) => handshake.query.uid === uid);
    const newCore = { ...core, socket, uid };

    await Promise.all([
      emitCreateUser({ ...newCore, create: !socket.user }),
      emitUserPlayed(newCore),
      emitGlobalPlayed({ ...newCore, socket: io }),
    ]);

    emitNewGame(newCore);
  });
