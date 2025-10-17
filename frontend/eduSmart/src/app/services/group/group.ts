import { HttpClient } from '@angular/common/http';
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
    return this.http.get<Group[]>(this.apiUrl);
  }

  deleteGroup(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`)
  }
}
