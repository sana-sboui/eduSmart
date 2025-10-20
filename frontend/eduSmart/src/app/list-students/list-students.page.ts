import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonFabButton,
  IonFab,
  AlertController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Student } from '../models/student.models';
import { StudentService } from '../services/student/student-service';

@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.page.html',
  styleUrls: ['./list-students.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonCard,
  ],
})
export class ListStudentsPage {
  filters: string[] = ['All'];
  activeFilter = 'All';
  searchTerm = '';
  students: Student[] = [];

  constructor(
    private studentService: StudentService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.listStudents().subscribe({
      next: (data) => {
        this.students = data;

        const groups = Array.from(
          new Set(
            data
              .map((s) => s.group?.name)
              .filter((name): name is string => !!name)
          )
        );

        this.filters = ['All', ...groups];
      },
      error: (err) => {
        console.error('Error loading students:', err);
      },
    });
  }

  get filteredStudents() {
    let filtered = this.students;

    if (this.activeFilter !== 'All') {
      filtered = filtered.filter(
        (student) => student.group?.name === this.activeFilter
      );
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.first_name?.toLowerCase().includes(term) ||
          student.last_name?.toLowerCase().includes(term) ||
          student.group?.name?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  async onDelete(studentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this student?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.deleteStudent(studentId);
          },
        },
      ],
    });

    await alert.present();
  }

  private async deleteStudent(studentId: number) {
    try {
      await this.studentService.deleteStudent(studentId).toPromise();
      this.loadStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
      this.showErrorAlert();
    }
  }

  async showErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Failed to delete student.',
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
}
