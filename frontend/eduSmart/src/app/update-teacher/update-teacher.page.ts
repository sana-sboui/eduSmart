import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { Teacher } from '../models/teacher.models';
import { TeacherService } from '../services/teacher/teacher';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-teacher',
  templateUrl: './update-teacher.page.html',
  styleUrls: ['./update-teacher.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonDatetime,
    IonModal,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonText,
  ],
})
export class UpdateTeacherPage {
  teacher: Teacher = {} as Teacher;
  confirm_password: string = '';
  maxDate: string;
  constructor(
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.maxDate = yesterday.toISOString().split('T')[0];
  }

  ngOnInit() {
    const teacherId = this.route.snapshot.paramMap.get('id');
    if (teacherId) {
      this.teacherService.getTeacherById(+teacherId).subscribe({
        next: (data) => {
          this.teacher = data;
          this.teacher.password = '';
        },
        error: (err) => console.error(err),
      });
    }
  }

  onDateChange(event: any) {
    this.teacher.date_of_birth = event.detail.value;
  }
  updateTeacher() {
    // Prepare payload
    const updateData: any = {
      id: this.teacher.id,
      first_name: this.teacher.first_name,
      last_name: this.teacher.last_name,
      email: this.teacher.email,
      tel: this.teacher.tel,
      speciality: this.teacher.speciality,
      date_of_birth: this.teacher.date_of_birth,
    };
    console.log('updated data ', updateData);

    if (this.teacher.date_of_birth) {
      updateData.date_of_birth = this.teacher.date_of_birth.split('T')[0];
    }

    // Only include password if entered
    if (this.teacher.password) {
      if (this.teacher.password !== this.confirm_password) {
        alert('Passwords do not match!');
        return;
      }
      updateData.password = this.teacher.password;
    }

    this.teacherService.updateTeacher(updateData).subscribe({
      next: async () => {
        await this.showToast(
          'Teacher updated successfully!',
          '#2b7b8e',
          '#ffffff'
        );
        this.router.navigate(['/list-teachers']);
      },
      error: async (err) => {
        console.error(err.error);
        await this.showToast('Error updating teacher!', '#eb445a', '#ffffff');
      },
    });
  }

  async showToast(
    message: string,
    bgColor: string = '#2b7b8e',
    textColor: string = '#ffffff'
  ) {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'bottom',
    });
    toast.style.setProperty('--background', bgColor);
    toast.style.setProperty('--color', textColor);
    await toast.present();
  }
}
