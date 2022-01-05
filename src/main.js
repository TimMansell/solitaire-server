import { setupExpress, setupDB, setupSockets, setupGraphQl } from './setup';

const main = async () => {
  const [express, db] = await Promise.all([setupExpress(), setupDB()]);

  setupSockets(express, db);
  setupGraphQl(express);
};

main();
