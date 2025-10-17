export interface User {
  id?: number;
  username: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  email?: string;
  date_of_birth?: string;
  tel?: string;
  status?: string;
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT';
  profile_picture?: string;
}
export interface AuthResponse {
  access: string;
  refresh: string;
  username: string;
  role: 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT';
  first_name: string;
  last_name: string;
  profile_picture: string;
}
