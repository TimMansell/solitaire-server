export const calculateResults = ({
  completed = 0,
  won = 0,
  lost = 0,
  quit = 0,
}) => ({
  completed,
  won,
  lost,
  quit,
});

export const calculatePercents = ({
  completed = 0,
  won = 0,
  lost = 0,
  quit = 0,
}) => {
  const wonPercent = completed ? won / completed : completed;
  const lostPercent = completed ? lost / completed : completed;
  const quitPercent = completed ? quit / completed : completed;

  return {
    won: wonPercent,
    lost: lostPercent,
    quit: quitPercent,
  };
};
