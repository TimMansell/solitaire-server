import numeral from 'numeral';
import { formatInTimeZone } from 'date-fns-tz/esm';

export const formatNumber = (value) => numeral(value).format('0,0');

export const formatPercent = (value) => numeral(value).format('0.00%');

export const formatDuration = (value) => numeral(value).format('00:00:00');

export const formatDate = (date, timezone) =>
  formatInTimeZone(date, timezone, 'dd-MM-yyyy');

export const formatTimeFromDate = (date, timezone) =>
  formatInTimeZone(date, timezone, 'HH:mm:ss');
