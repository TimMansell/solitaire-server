import { watchVersion, watchUsers, watchGames } from '#@/db/watch';
import { emitNewUpdate } from './emit/app';
import { emitPlayerCount } from './emit/players';
import { emitUserPlayed, emitGlobalPlayed } from './emit/stats';
import { emitCreateUser } from './emit/user';

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

    emitCreateUser({ ...newCore, create: !socket.user });
    emitUserPlayed(newCore);
    emitGlobalPlayed({ ...newCore, socket: io });
  });
