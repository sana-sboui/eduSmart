import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from 'src/app/models/teacher.models';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private apiUrl = 'http://localhost:8000/accounts/admin';
  constructor(private http: HttpClient) {}

  // create teacher
  createTeacher(teacher: Teacher): Observable<Teacher> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token not found. Please log in first.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<Teacher>(
      `${this.apiUrl}/create-enseignant`,
      teacher,
      { headers }
    );
  }

  //list teacher
  listTeachers(): Observable<Teacher[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token not found. Please log in first.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Teacher[]>(`${this.apiUrl}/liste-enseignant`, {
      headers,
    });
  }

  //delete teacher
  deleteTeacher(id: number) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token not found. Please log in first.');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return this.http.delete(`${this.apiUrl}/delete-enseignant/${id}`, {
      headers,
    });
  }
  //get teacher by id
  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/update-enseignant/${id}`);
  }

  //update teacher
  updateTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(
      `${this.apiUrl}/update-enseignant/${teacher.id}`,
      teacher
    );
  }
}
