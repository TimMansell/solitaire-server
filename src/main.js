import { setupExpress } from './express';
import { setupDB } from './db';
import { setupSockets, initSockets } from './sockets';
import { initWatchers } from './watchers';

const main = async () => {
  const [express, db] = await Promise.all([setupExpress(), setupDB()]);
  const sockets = setupSockets(express);

  initWatchers(db);
  initSockets(sockets);
};

main();
