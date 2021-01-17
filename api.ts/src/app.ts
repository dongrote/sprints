import _ from 'lodash';
import express, {Request, Response, NextFunction} from 'express';
import logger from 'debug-logger';
import HttpError from 'http-error-constructor';
import cookieParser from 'cookie-parser';
import routes from './routes';

const log = logger('api:app');
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);
app.use((req: Request, res: Response, next: NextFunction) => next(new HttpError(404)));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const status: number = _.get(err, 'statusCode', 500);
  log.error(err);
  res.status(status).json({error: {message: err.message}});
});

export default app;