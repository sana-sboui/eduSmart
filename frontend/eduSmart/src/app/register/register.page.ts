import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonSelectOption, IonButton, IonInput } from '@ionic/angular/standalone';
import { User } from '../models/user.models';
import { Auth } from '../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel,IonButton,IonInput]
})
export class RegisterPage  {

  user: User = { username: '', email: '',tel:'',role: 'ETUDIANT',password:'' };
  password2: string = '';
  errorMessage: string | null = null;

  constructor(private authService: Auth, private router: Router) {}

  onSubmit(form: any) {
    if (form.invalid || this.user.password!=this.password2 ) return;
    this.authService.register(this.user).subscribe({     
      next: () => this.router.navigate(['/login']),
      error: (err) => this.errorMessage = err.error.detail || 'Registration failed'
    });
  }

}
