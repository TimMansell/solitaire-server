import {
  onVersionUpdate,
  onUsersUpdate,
  onGamesUpdate,
} from './queries/watchers';

export * from './queries/game';
export * from './queries/stats';
export * from './queries/user';

// eslint-disable-next-line import/prefer-default-export
export const initWatchers = () => {
  onVersionUpdate();
  onUsersUpdate();
  onGamesUpdate();
};
