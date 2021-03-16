import _ from 'lodash';
import express, {Request, Response, NextFunction} from 'express';
import path from 'path';
import logger from 'debug-logger';
import httplog from 'morgan';
import HttpError from 'http-error-constructor';
import cookieParser from 'cookie-parser';
import routes from './routes';
import GoogleUserAuthenticator from './core/Authentication/GoogleUserAuthenticator';

const log = logger('api:app');
const app = express();

GoogleUserAuthenticator.installOntoPassport();

app.use(httplog('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
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
