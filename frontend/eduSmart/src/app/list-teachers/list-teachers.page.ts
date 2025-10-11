import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonFabButton,
  IonFab,
} from '@ionic/angular/standalone';
import { Teacher } from '../models/teacher.models';
import { TeacherService } from '../services/teacher/teacher';
import { Auth } from '../services/auth/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-list-teachers',
  templateUrl: './list-teachers.page.html',
  styleUrls: ['./list-teachers.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonCard,
    IonFab,
    IonFabButton,
  ],
})
export class ListTeachersPage {
  filters: string[] = ['All'];
  activeFilter = 'All';
  searchTerm = '';
  enseignants: Teacher[] = [];

  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private alertController: AlertController,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['reload']) {
      this.loadTeachers();
    } else {
      this.loadTeachers();
    }
  }

  loadTeachers() {
    this.teacherService.listTeachers().subscribe({
      next: (data) => {
        this.enseignants = data;
        const specialities = Array.from(
          new Set(data.map((t) => t.speciality))
        ).filter((s) => !!s);
        this.ngZone.run(() => {
          this.filters = ['All', ...specialities];
        });
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
      },
    });
  }

  get filteredTeachers() {
    let filtered = this.enseignants;

    if (this.activeFilter !== 'All') {
      filtered = filtered.filter(
        (teacher) => teacher.speciality === this.activeFilter
      );
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (teacher) =>
          teacher.first_name?.toLowerCase().includes(term) ||
          teacher.last_name?.toLowerCase().includes(term) ||
          teacher.speciality?.toLowerCase().includes(term)
      );
    }
    return filtered;
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  onEdit(id: number) {
    this.router.navigate([`/update-teacher`, id]);
  }

  async onDelete(teacherId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this teacher?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.deleteTeacher(teacherId);
          },
        },
      ],
    });

    await alert.present();
  }

  private async deleteTeacher(teacherId: number) {
    try {
      await this.teacherService.deleteTeacher(teacherId).toPromise();
      // Refresh the list after successful deletion
      this.loadTeachers();
    } catch (err) {
      console.error('Error deleting teacher:', err);
      this.showErrorAlert();
    }
  }

  async showErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Failed to delete teacher.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  getInitials(firstName: string, lastName: string): string {
    if (!firstName && !lastName) return '?';

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    return `${firstInitial}${lastInitial}`;
  }

  addEnseignant() {
    this.router.navigate(['/create-teacher']);
  }
}
