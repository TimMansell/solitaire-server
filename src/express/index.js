import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';

// eslint-disable-next-line import/prefer-default-export
export const setupExpress = () => {
  const APP_PORT = process.env.PORT || 5000;

  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
    })
  );

  const server = app.listen(APP_PORT, () => {
    console.log(`Express is listening on port ${APP_PORT}`);
  });

  app.get('/', (req, res) => {
    res.send('Server is responding :)');
  });

  return server;
};
