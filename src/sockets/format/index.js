import { formatTime } from '#@/helpers/times';
import { formatNumber, formatPercent } from '#@/helpers/numbers';
import { gameOutcome } from '#@/helpers/game';

export const formatLeaderboardGames = (
  leaderboardGames,
  players,
  { showBest }
) =>
  leaderboardGames.map((item, index) => {
    const { uid } = item;

    const player = players.find(({ uid: id }) => id === uid);

    const defaultItems = {
      rank: index + 1,
      player: player?.name ?? 'Unknown Player',
    };

    const results = {
      moves: () => {
        const { date, moves } = item;

        return {
          ...defaultItems,
          date,
          moves,
        };
      },
      time: () => {
        const { date, time } = item;

        return {
          ...defaultItems,
          date,
          time: formatTime(time),
        };
      },
      winPercent: () => {
        const { stats } = item;

        return {
          ...defaultItems,
          won: formatPercent(stats.won),
        };
      },
      wins: () => {
        const { games } = item;

        return {
          ...defaultItems,
          won: formatNumber(games.won),
        };
      },
    };

    return results[showBest]?.() ?? item;
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

export const formatStats = ({ games, stats }) => [
  [
    formatNumber(games.completed),
    formatNumber(games.won),
    formatNumber(games.lost),
    formatNumber(games.quit),
  ],
  [
    '',
    formatPercent(stats.won),
    formatPercent(stats.lost),
    formatPercent(stats.quit),
  ],
];

export const formatEmptyStats = () => {
  const stats = {
    games: {
      completed: 0,
      won: 0,
      lost: 0,
      quit: 0,
    },
    stats: {
      won: formatPercent(0),
      lost: formatPercent(0),
      quit: formatPercent(0),
    },
  };

  const formattedStats = formatStats(stats);

  return formattedStats;
};
