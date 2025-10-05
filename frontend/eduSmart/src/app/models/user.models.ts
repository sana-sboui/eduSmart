export interface User {
  id?: number;
  username: string;
  first_name?: string;
  last_name?: string;
  password?:string;
  email?: string;
  tel?: string;
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT';
}
export interface AuthResponse {
  access: string;
  refresh: string;
  username: string;
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT';
}