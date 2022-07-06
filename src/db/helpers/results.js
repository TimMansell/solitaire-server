import {
  formatNumber,
  formatPercent,
  formatDuration,
  formatTimeFromDate,
  formatDate,
} from './format';

export const formatLeaderboards = ({
  rank,
  name,
  date,
  time,
  moves,
  wonPercent,
  won,
  timezone,
}) => ({
  rank,
  name,
  ...(date && { date: formatDate(date, timezone) }),
  ...(time && { time: formatDuration(time) }),
  ...(moves && { moves }),
  ...(wonPercent && { wonPercent: formatPercent(wonPercent) }),
  ...(won && { won: formatNumber(won) }),
});

export const formatGames = ({
  played,
  rank,
  date,
  outcome,
  moves,
  time,
  timezone,
}) => ({
  number: formatNumber(played - rank),
  date: formatDate(date, timezone),
  time: formatTimeFromDate(date, timezone),
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
