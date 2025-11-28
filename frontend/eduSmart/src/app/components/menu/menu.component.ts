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
import { GroupService } from 'src/app/services/group/group';

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
  ],
})
export class MenuComponent {
  user: User;
  activeUrl: string = '';
  userGroups: any[] = [];
  expandedGroupId: number | null = null;
  expandedAdminSection: string | null = null;
  profile: string = '';

  constructor(
    private authService: Auth, 
    private router: Router, 
    private groupService: GroupService
  ) {
    this.user = this.authService.getCurrentUser();
    this.user.id = this.authService.getLoggedInUser()!.id;
    this.profile = `http://127.0.0.1:8000${this.user.profile_picture}`
    console.log('user', this.user);
  }

  ngOnInit() {
    // Set active URL initially
    this.activeUrl = this.router.url;
    // Update when route changes
    this.router.events.subscribe(() => {
      this.activeUrl = this.router.url;
    });
    if (this.user?.id) {
      this.loadUserGroups(this.user.id.toString());
    }
  }

  loadUserGroups(userId: string) {
    this.groupService.getGroupByUser(userId).subscribe({
      next: (groups: any) => {
        this.userGroups = groups;
        console.log('User groups:', groups);
      },
      error: (err) => {
        console.error('Error loading user groups', err);
      },
    });
  }

  toggleGroup(groupId: number) {
    this.expandedGroupId = this.expandedGroupId === groupId ? null : groupId;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
    this.setActiveItem(url);
  }
  navigateToCourses(){
    this.router.navigate(['/cours-liste']);
    this.setActiveItem('/cours-liste');
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
    this.setActiveItem('/profile');
  }

  navigateToChangePassword() {
    this.router.navigate(['/password-change']);
    this.setActiveItem('/password-change');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  getUserInitials(): string {
    const firstInitial = this.user.first_name?.charAt(0)?.toUpperCase() || '';
    const lastInitial = this.user.last_name?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  hasProfilePicture(): boolean {
    return !!(this.user.profile_picture && this.user.profile_picture.trim() !== '');
  }

  // appPages = [
  //   { title: 'Home', url: '/home', icon: 'home' },
  //   { title: 'Students', url: '/students', icon: 'people', roles: ['ADMIN'] },
  //   {
  //     title: 'Teachers',
  //     url: '/teachers',
  //     icon: 'school',
  //     roles: ['ETUDIANT'],
  //   },
  // ];

  // accountPages = [
  //   { title: 'Profile', url: '/profile'},
  //   { title: 'Change Password', url: '/password-change'}
  // ];

  // get filteredAccounts() {
  //   return this.accountPages.filter(
  //     (page) => !page.roles || page.roles.includes(this.user.role)
  //   );
  // }

  // get filteredPages() {
  //   return this.appPages.filter(
  //     (page) => !page.roles || page.roles.includes(this.user.role)
  //   );
  // }

  setActiveItem(url: string) {
    this.activeUrl = url;
  }

  toggleAdminMenu(section: string) {
    this.expandedAdminSection = this.expandedAdminSection === section ? null : section;
  }
}