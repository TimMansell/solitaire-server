import 'dotenv/config';

// eslint-disable-next-line import/prefer-default-export
export const checkVersion = (localVersion) => {
  const { APP_VERSION } = process.env;
  const matches = APP_VERSION === localVersion || localVersion === null;

  return { version: APP_VERSION, matches };
};
