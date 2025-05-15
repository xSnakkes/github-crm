import { Request } from 'express';
import { User } from 'src/user/model/user.model';

export interface RequestWithUser extends Request {
  user: User;
}
