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
  const gamesCompleted = games.length;
  const gamesWon = games.filter(({ won }) => won).length;
  const gamesLost = games.filter(({ lost }) => lost).length;
  const gamesQuit = gamesCompleted - gamesWon - gamesLost;

  const completed = formatNumber(gamesCompleted);
  const won = formatNumber(gamesWon);
  const lost = formatNumber(gamesLost);
  const quit = formatNumber(gamesQuit);

  const wonPercent = formatPercent(gamesWon / gamesCompleted);
  const lostPercent = formatPercent(gamesLost / gamesCompleted);
  const quitPercent = formatPercent(gamesQuit / gamesCompleted);

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
  [completed, won, lost, quit],
  ['', wonPercent, lostPercent, quitPercent],
];

export const formatEmptyStats = () => {
  const stats = {
    completed: formatNumber(0),
    won: formatNumber(0),
    lost: formatNumber(0),
    quit: formatNumber(0),
    wonPercent: formatPercent(0),
    lostPercent: formatPercent(0),
    quitPercent: formatPercent(0),
  };

  const formattedStats = formatStats(stats);

  return formattedStats;
};
