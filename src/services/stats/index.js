import { formatTime } from '@/helpers/times';
import { formatNumber, formatPercent } from '@/helpers/numbers';
import { gameOutcome } from '@/helpers/game';

export const getLeaderboadSortBy = (showBest) => {
  if (showBest === 'times') {
    return 'time';
  }

  return 'moves';
};

export const formatLeaderboardGames = (games, players, sortBy) =>
  games.map((item, index) => {
    const { uid, date, time, moves } = item;

    const player = players.find(({ uid: id }) => id === uid);

    const defaultItems = {
      rank: index + 1,
      date,
      player: player?.name ?? 'Unknown Player',
    };

    if (sortBy === 'moves') {
      return {
        ...defaultItems,
        moves,
      };
    }

    if (sortBy === 'time') {
      return {
        ...defaultItems,
        duration: formatTime(time),
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

export const formatStats = ({
  completed,
  won,
  lost,
  quit,
  wonPercent,
  lostPercent,
  quitPercent,
}) => [
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

export const formatEmptyStats = () => {
  const stats = {
    completed: 0,
    won: 0,
    lost: 0,
    quit: 0,
    wonPercent: 0,
    lostPercent: 0,
    quitPercent: 0,
  };

  const formattedStats = formatStats(stats);

  return formattedStats;
};
