import { setupExpress } from './express';
import { setupDB, initWatchers } from './db';
import { setupSockets, initSockets } from './sockets';

const main = async () => {
  const [express] = await Promise.all([setupExpress(), setupDB()]);
  const sockets = setupSockets(express);

  initWatchers();
  initSockets(sockets);
};

main();
