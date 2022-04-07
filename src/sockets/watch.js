import { watchVersion, watchUsers, watchGames } from '#@/db/watch';
import { newUpdate } from './app';
import { setPlayerCount } from './players';
import { setUserPlayed, setGlobalPlayed } from './stats';
import { createUser } from './user';
import { newGame } from './game';

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

      sockets.forEach((socket) => newUpdate({ socket, appVersion }));
    }
  );

export const watchForUsersUpdate = ({ io, ...core }) =>
  watchUsers(core).on('change', () => setPlayerCount({ ...core, socket: io }));

export const watchForGamesUpdate = ({ io, ...core }) =>
  watchGames(core).on('change', async ({ fullDocument: { uid } }) => {
    const sockets = await io.fetchSockets();
    const socket = sockets.find(({ handshake }) => handshake.query.uid === uid);
    const newCore = { ...core, socket, uid };

    newGame(newCore);
    createUser(newCore);
    setUserPlayed(newCore);
    setGlobalPlayed({ ...newCore, socket: io });
  });
