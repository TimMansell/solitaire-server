import { setupExpress } from './express';
import { setupDB } from './db';
import { setupSockets, initSockets } from './sockets';
import { initWatchers } from './watchers';

// eslint-disable-next-line import/prefer-default-export
export const isTest = process.env.NODE_ENV === 'test';

const main = async () => {
  try {
    const db = await setupDB();

    const [express, ...sockets] = await Promise.all([
      setupExpress(),
      setupSockets('v1'),
      setupSockets('test'),
    ]);

    initWatchers(db);
    initSockets(express, sockets);
  } catch (error) {
    console.log({ error });
  }
};

main();
