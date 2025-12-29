import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';
import routes from './routes';

const createApp = (): Express => {
  const app = express();

  const allowedOrigins: string[] = config.get('cors.allowedOrigins');
  
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  app.use(helmet());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.send('demo-app API');
  });

  app.use('/', routes);

  return app;
};

export default createApp;
