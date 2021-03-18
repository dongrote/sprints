import { Request } from 'express';
import AccessToken from '../core/Authentication/AccessToken';
import RefreshToken from '../core/Authentication/RefreshToken';

export type RequestWithTokens = Request & {accessToken: AccessToken, refreshToken: RefreshToken};
