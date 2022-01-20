import { formatTime } from '@/helpers/times';
import { formatNumber, formatPercent } from '@/helpers/numbers';
import { gameOutcome } from '@/helpers/game';

export const formatLeaderboardGames = (games, players, { showBest }) =>
  games.map((item, index) => {
    const { uid, date } = item;

    const player = players.find(({ uid: id }) => id === uid);

    const defaultItems = {
      rank: index + 1,
      player: player?.name ?? 'Unknown Player',
    };

    if (showBest === 'moves') {
      const { moves } = item;

      return {
        ...defaultItems,
        date,
        moves,
      };
    }

    if (showBest === 'time') {
      const { time } = item;

      return {
        ...defaultItems,
        date,
        time: formatTime(time),
      };
    }

    if (showBest === 'wonPercent') {
      const { percentages } = item;

      return {
        ...defaultItems,
        won: formatPercent(percentages.won),
      };
    }

    return defaultItems;
  });

export const formatHistoryGames = (games, gamesPlayed, offset) =>
  games.map(({ date, won, lost, time, moves }, index) => ({
    number: formatNumber(gamesPlayed - offset - index),
    date,
    time: date,
    outcome: gameOutcome({ won, lost }),
    moves,
    duration: formatTime(time),
  }));

export const formatStats = ({ games, percentages }) => [
  [
    formatNumber(games.completed),
    formatNumber(games.won),
    formatNumber(games.lost),
    formatNumber(games.quit),
  ],
  ['', percentages.won, percentages.lost, percentages.quit],
];

export const formatEmptyStats = () => {
  const stats = {
    games: {
      completed: 0,
      won: 0,
      lost: 0,
      quit: 0,
    },
    percentages: {
      won: 0,
      lost: 0,
      quit: 0,
    },
  };

  const formattedStats = formatStats(stats);

  return formattedStats;
};
