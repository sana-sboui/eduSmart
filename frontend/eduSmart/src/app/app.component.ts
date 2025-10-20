import { Component } from '@angular/core';
import {
  IonApp,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { MenuComponent } from './components/menu/menu.component';
import { Auth } from './services/auth/auth';
import { Router } from '@angular/router';
import { User } from './models/user.models';
import { CommonModule } from '@angular/common';
import { IonBackdrop } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    MenuComponent,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonMenuButton,
    IonBackButton,
  ],
})
export class AppComponent {
  user: User | null = null;
  constructor(private authService: Auth, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getLoggedInUser();

    // Optionally, subscribe to changes
    this.authService.currentUser$.subscribe((u) => {
      this.user = u;
    });
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url.includes('/auth');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
