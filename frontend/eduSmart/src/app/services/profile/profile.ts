import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/student.models';
import { Teacher } from 'src/app/models/teacher.models';

@Injectable({
  providedIn: 'root'
})
export class Profile {
  private apiUrl = 'http://127.0.0.1:8000/accounts/auth/profile/';

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Student | Teacher> {
    return this.http.get<Student | Teacher>(this.apiUrl);
  }

  updateProfile(profile: any) {
  const formData = new FormData();
  formData.append('first_name', profile.first_name);
  formData.append('last_name', profile.last_name);
  formData.append('email', profile.email);
  formData.append('username', profile.username);
  formData.append('tel', profile.tel);
  formData.append('status', profile.status);
  formData.append('speciality', profile.speciality);
  formData.append('date_of_birth', profile.date_of_birth);

  if (profile.profile_picture && profile.profile_picture.startsWith('data:image')) {
    const blob = this.dataURLtoBlob(profile.profile_picture);
    if (blob) { 
      formData.append('profile_picture', blob, 'profile.jpg');
    }
  }

  return this.http.patch(`${this.apiUrl}`, formData);
}
changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/accounts/auth/change-password/`, {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

dataURLtoBlob(dataURL: string | null): Blob | null {
  if (!dataURL || !dataURL.includes(',')) return null;

  try {
    const parts = dataURL.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  } catch (e) {
    console.error('Erreur conversion dataURL en Blob :', e);
    return null;
  }
}
}
