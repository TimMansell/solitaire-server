import { setupExpress, setupDB } from './setup';
import { setupSockets } from './sockets';

const main = async () => {
  const servers = await Promise.all([setupExpress(), setupDB()]);

  setupSockets(servers);
};

main();
