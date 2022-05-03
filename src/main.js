import { setupExpress, setupDB, setupSockets } from './setup';
import { initSockets } from './sockets';
import { initWatchers } from './query/db';

const main = async () => {
  const [express] = await Promise.all([setupExpress(), setupDB()]);
  const sockets = setupSockets(express);

  initWatchers();
  initSockets(sockets);
};

main();
