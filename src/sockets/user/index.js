import EventEmitter from 'eventemitter3';
import queryString from 'query-string';

import { setupEmit } from '../emit';
import { checkVersion } from '../emit/app';
import { initGame, saveGame } from '../emit/game';
import { getUserDetails, getUserGames } from '../emit/user';
import {
  stats,
  getUserPlayed,
  leaderboards,
  getGlobalPlayed,
  getPlayerCount,
} from '../emit/stats';
import { watchDB } from '#db/watchers/watchers';

const pipeAwait =
  (...fns) =>
  (param) =>
    fns.reduce(async (result, fn) => fn(await result), param);

const getQueryParams = (url) => {
  const { query } = queryString.parseUrl(url, { parseBooleans: true });

  return query;
};

const messageEmits = [saveGame, getUserGames, stats, leaderboards];

const initEmits = [
  initGame,
  getUserDetails,
  getUserPlayed,
  getPlayerCount,
  getGlobalPlayed,
];

// eslint-disable-next-line import/prefer-default-export
export const newUser = (url) => {
  const emitter = new EventEmitter();
  const params = getQueryParams(url);
  const db = watchDB();
  const emit = setupEmit(emitter);

  db.on('newGame', (uid) => {
    if (params.uid !== uid) return;

    pipeAwait(getUserPlayed, emit)(params);
  });

  db.on('newVersion', (appVersion) =>
    pipeAwait(checkVersion, emit)({ ...params, appVersion })
  );

  initEmits.forEach((fn) => pipeAwait(fn, emit)(params));

  return {
    on: (event, cb) => emitter.on(event, cb),
    message: (message) => {
      const { name, payload } = JSON.parse(message);
      const runEvent = messageEmits.find(({ name: fnName }) => fnName === name);

      if (!runEvent) throw new Error('Invalid message name');

      pipeAwait(runEvent, emit)({ ...payload, ...params });
    },
  };
};
