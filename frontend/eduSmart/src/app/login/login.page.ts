import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonCard, IonCardHeader, IonCardContent, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonButton, IonHeader, IonToolbar, IonContent, IonItem } from '@ionic/angular/standalone';
import { Auth } from '../services/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonCard, IonCardHeader, IonCardContent, IonTitle, IonSegment, IonSegmentButton, IonLabel, IonButton, IonHeader, IonToolbar, IonContent, IonItem]
})

export class LoginPage  {

  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit(form: any) {
    if (form.invalid) return;

    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.errorMessage = err.error.detail || 'Login failed';
      }
    });
}

}
