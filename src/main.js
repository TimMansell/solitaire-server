import { setupExpress, setupDB } from './setup';
import { setupSockets } from './sockets';
import { setupGraphQl } from './graphql';

const main = async () => {
  const [express, db] = await Promise.all([setupExpress(), setupDB()]);

  setupSockets(express, db);
  setupGraphQl(express);
};

main();
