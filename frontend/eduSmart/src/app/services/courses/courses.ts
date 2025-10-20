import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from 'src/app/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://127.0.0.1:8000/cours/courses/'; 

  constructor(private http: HttpClient) {}

  //Liste des cours
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  //Détails cours
  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}${id}/`);
  }

  // ajout  cours 
  createCourse(course: Course): Observable<Course> {
    const formData = new FormData();
    formData.append('title', course.title);
    if (course.description) formData.append('description', course.description);
    if (course.file) formData.append('file', course.file);
    if (course.groups) {
  course.groups.forEach(g => formData.append('groups', Number(g).toString()));

}
    return this.http.post<Course>(this.apiUrl, formData);
  }

  // update cours
  updateCourse(id: number, course: Course): Observable<Course> {
    const formData = new FormData();
    formData.append('title', course.title);
    if (course.description) formData.append('description', course.description);
    if (course.file instanceof File) formData.append('file', course.file);
    //course.groups.forEach(g => formData.append('groups', g.toString()));
    return this.http.put<Course>(`${this.apiUrl}${id}/`, formData);
  }

  // delete
  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
  getCoursesByGroup(groupId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}by-group/${groupId}/`);
  }
  
}
