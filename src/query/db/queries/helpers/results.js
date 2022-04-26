import { formatNumber, formatPercent, formatDuration } from './format';

export const formatLeaderboards = ({
  rank,
  name,
  date,
  time,
  moves,
  wonPercent,
  won,
}) => ({
  rank,
  name,
  ...(date && { date }),
  ...(time && { time: formatDuration(time) }),
  ...(moves && { moves }),
  ...(wonPercent && { wonPercent: formatPercent(wonPercent) }),
  ...(won && { won: formatNumber(won) }),
});

export const formatGames = ({ played, rank, date, outcome, moves, time }) => ({
  number: formatNumber(played - rank),
  date,
  time: date,
  outcome,
  moves,
  duration: formatDuration(time),
});

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