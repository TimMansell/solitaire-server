import { getAllGames } from '#@/db/stats';
import { getAllUsers } from '#@/db/user';
import { calculatePercents } from '#@/db/format';
import { setupDB } from '#@/setup';

const calculateGameResults = (games) => {
  const completed = games.length;
  const won = games.filter(({ won: w }) => w).length;
  const lost = games.filter(({ lost: l }) => l).length;
  const quit = completed - won - lost;

  return { completed, won, lost, quit };
};

const main = async () => {
  const db = await setupDB();

  try {
    const [allGames, allUsers] = await Promise.all([
      getAllGames(db),
      getAllUsers(db),
    ]);

    const userStats = allUsers.map(({ uid }) => {
      const userGames = allGames.filter(({ uid: uuid }) => uuid === uid);
      const games = calculateGameResults(userGames);
      const stats = calculatePercents(games);

      return { uid, games, stats };
    });

    const bulk = db.collection('users').initializeUnorderedBulkOp();

    userStats.forEach((user) => {
      const { uid } = user;

      bulk
        .find({ uid })
        .upsert()
        .update({ $set: { #@.user } });
    });

    await bulk.execute();

    console.log('stats updated');
  } catch (error) {
    console.log({ error });
  }
};

main();
