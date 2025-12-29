process.env.NODE_CONFIG_DIR = `${__dirname}/config/`;

import http from 'http';
import createApp from './app';
import config from 'config';

const app = createApp();
const server = http.createServer(app);

const port = config.get<number>('port') || 3000;

const startServer = (): void => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

const gracefulShutdown = (signal: string): void => {
  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

startServer();
