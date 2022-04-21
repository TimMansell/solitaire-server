import { formatTime } from '#@/helpers/times';
import { formatNumber, formatPercent } from '#@/helpers/numbers';
// import { gameOutcome } from '#@/helpers/game';

export const formatLeaderboardGames = (leaderboards, { showBest }) => {
  const formats = [
    {
      key: 'moves',
      format: ({ defaultItems, date, moves }) => {
        return {
          ...defaultItems,
          date,
          moves,
        };
      },
    },
    {
      key: 'time',
      format: ({ defaultItems, date, time }) => {
        return {
          ...defaultItems,
          date,
          time: formatTime(time),
        };
      },
    },
    {
      key: 'winPercent',
      format: ({ defaultItems, stats }) => {
        return {
          ...defaultItems,
          won: formatPercent(stats.won),
        };
      },
    },
    {
      key: 'wins',
      format: ({ defaultItems, games }) => {
        return {
          ...defaultItems,
          won: formatNumber(games.won),
        };
      },
    },
  ];

  const { format } = formats.find(({ key }) => key === showBest);

  const results = leaderboards.map(({ name, ...leaderboard }, index) => {
    const defaultItems = {
      rank: index + 1,
      player: name,
    };

    const game = format({ defaultItems, ...leaderboard });

    return game;
  });

  return results;
};

// export const formatHistoryGames = ([games, gamesPlayed], { offset }) =>
//   games.map(({ date, won, lost, time, moves }, index) => ({
//     number: formatNumber(gamesPlayed - offset - index),
//     date,
//     time: date,
//     outcome: gameOutcome({ won, lost }),
//     moves,
//     duration: formatTime(time),
//   }));

export const formatStats = ({ completed, won, lost, quit }) => {
  const wonPercent = completed ? won / completed : completed;
  const lostPercent = completed ? lost / completed : completed;
  const quitPercent = completed ? quit / completed : completed;

  return [
    [
      formatNumber(completed),
      formatNumber(won),
      formatNumber(lost),
      formatNumber(quit),
    ],
    [
      '',
      formatPercent(wonPercent),
      formatPercent(lostPercent),
      formatPercent(quitPercent),
    ],
  ];
};
