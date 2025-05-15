import { User } from 'user/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user_id?: string;
      user?: User;
    }
  }
}
