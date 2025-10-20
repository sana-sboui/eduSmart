export interface Course {
  id?: number;
  title: string;
  description?: string;
  file?: File | string; 
  teacher?: number; 
  groups?: number[]; 
  created_at?: string;
  updated_at?: string;
}
