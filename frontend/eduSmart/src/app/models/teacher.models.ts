import { User } from './user.models';

export interface Teacher extends User {
  speciality: string;
}
