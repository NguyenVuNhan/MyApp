import { Request } from 'express';
import { User } from '@app/user/shared';

export interface RequestWithUser extends Request {
  user: User;
}
