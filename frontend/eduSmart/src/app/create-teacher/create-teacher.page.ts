import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonModal,
  IonDatetimeButton,
} from '@ionic/angular/standalone';
import { Teacher } from '../models/teacher.models';
import { TeacherService } from '../services/teacher/teacher';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.page.html',
  styleUrls: ['./create-teacher.page.scss'],
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
export class CreateTeacherPage {
  teacher: Teacher = {
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    tel: '',
    date_of_birth: '',
    speciality: '',
    role: 'ENSEIGNANT',
  };
  confirm_password = '';
  maxDate: string;
  constructor(
    private teacherService: TeacherService,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.maxDate = yesterday.toISOString().split('T')[0];
  }

  async createTeacher() {
    if (this.teacher.password !== this.confirm_password) {
      this.showAlert('Error', 'Passwords do not match');
      return;
    }

    this.teacherService.createTeacher(this.teacher).subscribe({
      next: async (res) => {
        console.log('teacher', this.teacher);
        await this.showToast(
          'Teacher created successfully!',
          '#2b7b8e',
          '#ffffff'
        );
        // Redirect after alert is dismissed
        this.router.navigate(['/list-teachers']);
      },
      error: async (err) => {
        console.error(err);
        let msg = 'Error creating teacher.';
        if (err.error?.username) msg = err.error.username;
        await this.showToast(msg, '#eb445a', '#ffffff');
      },
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async showToast(
    message: string,
    bgColor: string = '#10dc60',
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

  onDateChange(event: any) {
    this.teacher.date_of_birth = event.detail.value.split('T')[0];
  }
}
