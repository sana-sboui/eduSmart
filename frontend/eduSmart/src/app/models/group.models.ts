import { Teacher } from "./teacher.models";
import { User } from "./user.models";

export interface Group {
  id: number;
  name: string;
  description: string;
  teacher: number;
  students: number[];
  teacher_detail: Teacher;
  students_detail: User[];
}