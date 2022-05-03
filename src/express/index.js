import express from 'express';

// eslint-disable-next-line import/prefer-default-export
export const setupExpress = () => {
  const APP_PORT = process.env.PORT || 5000;

  const app = express();
  const server = app.listen(APP_PORT, () => {
    console.log(`Express is listening on port ${APP_PORT}`);
  });

  app.get('/', (req, res) => {
    res.send('Server is responding :)');
  });

  return server;
};
