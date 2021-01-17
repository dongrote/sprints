import 'dotenv/config';
import logger from 'debug-logger';
import env from './env';
import app from './app';
import http from 'http';

const log = logger('api:server'),
  port = env.port();

http.createServer(app)
  .on('error', (err): void => {
    log.error(err);
    process.exit(1);
  })
  .on('listening', (): void => log.info(`listening on port ${port}`))
  .listen(port);
