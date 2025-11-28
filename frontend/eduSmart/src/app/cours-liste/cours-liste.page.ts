import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  NavController,
  AlertController,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses/courses';
import { Auth } from '../services/auth/auth';

@Component({
  selector: 'app-cours-liste',
  templateUrl: './cours-liste.page.html',
  styleUrls: ['./cours-liste.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonFab,
    IonFabButton,
  ],
})
export class CoursListePage implements OnInit {
  courses: Course[] = [];
  teacherId = this.authService.getLoggedInUser()?.id;

  constructor(
    private courseService: CoursesService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: Auth
  ) {}
  ionViewWillEnter() {
    this.loadCourses();
  }
  ngOnInit() {
    this.loadCourses();
  }
  loadCourses() {
    console.log('id', this.teacherId);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => console.error('Erreur chargement cours:', err),
    });
  }
  addNewCourse() {
    this.navCtrl.navigateForward('/upload-cours');
  }
  editCourse(course: Course) {
    this.navCtrl.navigateForward(`/cours-edit/${course.id}`);
  }
  async onDelete(course: Course) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete the course ${course.title}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.deleteCourse(course);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteCourse(course: Course) {
    this.courseService.deleteCourse(course.id!).subscribe({
      next: () => {
        this.courses = this.courses.filter((c) => c.id !== course.id);
      },
      error: (err) => console.error('Erreur suppression:', err),
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }

  getFileName(file?: string | File): string {
    if (!file) return '';

    let fileName = '';

    if (file instanceof File) {
      fileName = file.name;
    } else {
      fileName = file.split('/').pop() || file;
    }

    // Remove file extension
    fileName = fileName.replace(/\.[^/.]+$/, '');

    // Split into parts by underscore
    const parts = fileName.split('_');

    // Check the last part ID or not
    const lastPart = parts[parts.length - 1];
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/.test(lastPart)) {
      parts.pop();
    }

    return parts.join('_');
  }
}
