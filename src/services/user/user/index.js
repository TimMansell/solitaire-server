import {
  checkLocalUserExists,
  fetchLocalUser,
  createLocalUser,
} from './localUser';

export { checkUserExistsOnServer, createUserOnServer } from './serverUser';

export const getLocalUser = () => {
  const userExists = checkLocalUserExists();

  const uid = userExists ? fetchLocalUser() : createLocalUser();

  return uid;
};
