// eslint-disable-next-line import/prefer-default-export
export const calculateStats = (games) => {
  const completed = games.length;
  const won = games.filter(({ won: w }) => w).length;
  const lost = games.filter(({ lost: l }) => l).length;
  const quit = completed - won - lost;

  const wonPercent = won / completed;
  const lostPercent = lost / completed;
  const quitPercent = quit / completed;

  return {
    completed,
    won,
    lost,
    quit,
    wonPercent,
    lostPercent,
    quitPercent,
  };
};
