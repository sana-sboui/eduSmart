import { User } from './user.models';

export interface Student extends User {
  status: string;
}
