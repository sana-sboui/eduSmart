import { Group } from './group.models';
import { User } from './user.models';

export interface Student extends User {
  group?: Group;
  status: string;
}
