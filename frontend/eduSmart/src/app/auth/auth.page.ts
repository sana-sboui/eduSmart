import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonDatetime,
  IonModal,
  IonSelect,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonIcon,
  IonSelectOption,
  IonDatetimeButton,
  IonText,
} from '@ionic/angular/standalone';
import { Auth } from '../services/auth/auth';
import { Router } from '@angular/router';
import { User } from '../models/user.models';

@Component({
  selector: 'app-login',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonDatetime,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    FormsModule,
    IonSelectOption,
    IonSelect,
    IonDatetimeButton,
    IonModal,
    IonText,
  ],
})
export class AuthPage {
  authMode: 'login' | 'register' = 'login';
  statusChoices = [
    ['STUDENT', 'Student'],
    ['EMPLOYEE', 'Employee'],
    ['OTHER', 'Other'],
  ];
  statusSelectOptions = {
    header: 'Select Status',
    translucent: true,
  };
  maxDate = new Date().toISOString();
  user: User = {
    username: '',
    email: '',
    tel: '',
    status: '',
    role: 'ETUDIANT',
    password: '',
    first_name: '',
    last_name: '',
  };
  password2: string = '';
  errorMessage: string | null = null;
  username: string = '';
  password: string = '';

  constructor(private authService: Auth, private router: Router) {}

  onSubmit(form: any) {
    if (form.invalid) return;
    if (this.authMode === 'login') {
      this.authService
        .login(this.user.username, this.user.password!)
        .subscribe({
          next: () => this.router.navigate(['/profile'], { replaceUrl: true }),
          error: (err) => {
            this.errorMessage = err.error.detail || 'Login failed';
          },
        });
    } else if (this.authMode === 'register') {
      if (this.user.password !== this.password2) {
        this.errorMessage = 'Passwords do not match';
        return;
      }
      this.authService.register(this.user).subscribe({     
      next: () => {
        this.user = {
          username: '',
          email: '',
          tel: '',
          status: '',
          role: 'ETUDIANT',
          password: '',
          first_name: '',
          last_name: '',
        };
        this.password2 = '';
        this.errorMessage = null;

        // Switch back to login segment
        this.authMode = 'login';
      },
      error: (err) => this.errorMessage = err.error.detail || 'Registration failed'
    });
    }
  }

  segmentChanged(event: any) {
    this.authMode = event.detail.value;
    this.errorMessage = null;
    console.log('Segment changed to:', this.authMode);
  }

  onDateChange(event: any) {
    this.user.date_of_birth = event.detail.value.split('T')[0];
  }

  onStatusChange(event: any) {
    console.log('Selected status:', event.detail.value);
    console.log('user.status:', this.user.status);
  }
}
