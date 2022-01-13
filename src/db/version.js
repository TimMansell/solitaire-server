import 'dotenv/config';

// eslint-disable-next-line import/prefer-default-export
export const getVersion = () => {
  const { APP_VERSION } = process.env;

  return APP_VERSION;
};
