import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/student.models';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private apiUrl = 'http://localhost:8000/accounts/admin';
  constructor(private http: HttpClient) {}

  //list teacher
  listStudents(): Observable<Student[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Token not found. Please log in first.');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Student[]>(`${this.apiUrl}/list-students`, {
      headers,
    });
  }

  //delete student
  deleteStudent(id: number) {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Token not found. Please log in first.');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return this.http.delete(`${this.apiUrl}/delete-student/${id}`, {
      headers,
    });
  }
}
