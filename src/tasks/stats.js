import {
  // getUserCounts,
  getGlobalCounts,
  // getPlayerStats,
  // getGlobalStats,
  // getLeaderboards,
} from '@/db/stats';
import { setupDB } from '../setup';

const main = async () => {
  const db = await setupDB();

  try {
    const counts = await getGlobalCounts(db);

    // socket.emit('getUserCounts', counts);

    console.log({ counts });
  } catch (error) {
    console.log({ error });
  }
};

main();
