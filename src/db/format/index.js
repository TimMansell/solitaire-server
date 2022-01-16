export const calculateGameResults = (games) => {
  const completed = games.length;
  const won = games.filter(({ won: w }) => w).length;
  const lost = games.filter(({ lost: l }) => l).length;
  const quit = completed - won - lost;

  return { completed, won, lost, quit };
};

export const calculateStats = ({
  completed = 0,
  won = 0,
  lost = 0,
  quit = 0,
}) => {
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
