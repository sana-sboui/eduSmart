import { Component, inject, OnInit } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses/courses';
import { Auth } from '../services/auth/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cours-group',
  templateUrl: './cours-group.page.html',
  styleUrls: ['./cours-group.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    IonIcon,
    IonCardContent,
    IonCard,
  ],
})
export class CoursGroupPage implements OnInit {
  courses: Course[] = [];
  groupId!: number;

  constructor(
    private courseService: CoursesService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private authService: Auth,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.groupId = +params['id'];
      this.loadGroupCourses();
    });
  }

  loadGroupCourses() {
    console.log('group:', this.groupId);
    this.courseService.getCoursesByGroup(this.groupId).subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => console.error('Error loading group courses:', err),
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
