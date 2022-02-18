import { setupExpress, setupDB } from './setup';
import { setupSockets } from './sockets';

const main = async () => {
  const [express, db] = await Promise.all([setupExpress(), setupDB()]);

  setupSockets(express, db);
};

main();
