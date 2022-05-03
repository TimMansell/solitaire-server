import { onVersionUpdate, onUsersUpdate, onGamesUpdate } from './watchers';

// eslint-disable-next-line import/prefer-default-export
export const initWatchers = () => {
  onVersionUpdate();
  onUsersUpdate();
  onGamesUpdate();
};
