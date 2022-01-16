// eslint-disable-next-line import/prefer-default-export
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
