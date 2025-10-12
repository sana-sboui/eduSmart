import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonAvatar,
  IonButton,
  IonFooter,
  IonNote,
  IonBadge,
} from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.models';
import { Auth } from 'src/app/services/auth/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    CommonModule,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    RouterModule,
    IonMenuToggle,
    IonBadge,
  ],
})
export class MenuComponent {
  user: User;

  activeUrl: string = '';

  constructor(private authService: Auth, private router: Router) {
    this.user = this.authService.getCurrentUser();
    console.log('user', this.user);
  }

  ngOnInit() {
    // Set active URL initially
    this.activeUrl = this.router.url;
    // Update when route changes
    this.router.events.subscribe(() => {
      this.activeUrl = this.router.url;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Students', url: '/students', icon: 'people', roles: ['ADMIN'] },
    {
      title: 'Teachers',
      url: '/teachers',
      icon: 'school',
      roles: ['ETUDIANT'],
    },
  ];

  get filteredPages() {
    return this.appPages.filter(
      (page) => !page.roles || page.roles.includes(this.user.role)
    );
  }

  setActiveItem(url: string) {
    this.activeUrl = url;
  }
}
