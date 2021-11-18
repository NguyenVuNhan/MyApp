import { User } from '@app/api/shared/type-orm';
import { Request } from 'express';

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
