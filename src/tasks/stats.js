import { getAllGames, updateGlobalStats, updatePlayerCount } from '@/db/stats';
import { getUsers } from '@/db/user';
import { calculateGameResults, calculateStats } from '@/db/format';
import { setupDB } from '../setup';

const updateBulkUsers = async (db) => {
  const [games, users] = await Promise.all([getAllGames(db), getUsers(db)]);

  const userStats = users.map(({ uid }) => {
    const userGames = games.filter(({ uid: uuid }) => uuid === uid);
    const gameTypes = calculateGameResults(userGames);
    const stats = calculateStats(gameTypes);

    return { uid, ...stats };
  });

  const bulk = db.collection('users').initializeUnorderedBulkOp();

  userStats.forEach((stat) => {
    const { uid } = stat;

    bulk
      .find({ uid })
      .upsert()
      .update({ $set: { ...stat } });
  });

  await bulk.execute();
};

const main = async () => {
  const db = await setupDB();

  try {
    await Promise.all([
      updateGlobalStats(db),
      updatePlayerCount(db),
      updateBulkUsers(db),
    ]);

    console.log('stats updated');
  } catch (error) {
    console.log({ error });
  }
};

main();
