import { Request } from 'express';
import { User } from '@app/user/shared';

export interface RequestWithUser extends Request {
  user: User;
}

export interface OAuthUser {
  name: string;
  email: string;
}

export interface RequestWithOAuthUser extends Request {
  user: OAuthUser;
}
