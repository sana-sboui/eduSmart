import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://127.0.0.1:8000/groups/';

  constructor(private http: HttpClient) {}

  getGroups(): Observable<Group[]> {
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //   throw new Error('Token not found. Please log in first.');
    // }

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${token}`,
    // });

    return this.http.get<Group[]>(this.apiUrl);
  }

  deleteGroup(id: number) {
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //   throw new Error('Token not found. Please log in first.');
    // }

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${token}`,
    // });

    return this.http.delete(`${this.apiUrl}${id}/`)
  }

  createGroup(group: any): Observable<Group> {
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //   throw new Error('Token not found. Please log in first.');
    // }

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${token}`,
    // });

    return this.http.post<Group>(`${this.apiUrl}`, group)
  }

  updateGroup(id: number, data: any) {
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //   throw new Error('Token not found. Please log in first.');
    // }

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${token}`,
    // });

    return this.http.patch(`${this.apiUrl}${id}/`, data);
  }

  getGroupById(id: number) {
    // const token = localStorage.getItem('access_token');
    // if (!token) {
    //   throw new Error('Token not found. Please log in first.');
    // }

    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${token}`,
    // });

    return this.http.get<Group>(`${this.apiUrl}${id}/`);
  }

  getGroupByUser(id: string) {
    return this.http.get<Group[]>(`${this.apiUrl}user/${id}/`);
  }
}
