import { User } from './user.models';

export interface Student extends User {
  group?: { id: number; name: string };
  status: string;
}
