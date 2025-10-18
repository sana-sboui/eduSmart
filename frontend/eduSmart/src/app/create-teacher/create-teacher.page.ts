import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
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
    IonContent,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
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
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
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

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPassword() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  async createTeacher() {
    if (this.teacher.password !== this.confirm_password) {
      this.showAlert('Error', 'Passwords do not match');
      return;
    }

    this.teacherService.createTeacher(this.teacher).subscribe({
      next: async (res) => {
        console.log('teacher', this.teacher);
        await this.showToast('Teacher created successfully!', 'success');
        // Redirect after alert is dismissed
        this.router.navigate(['/list-teachers']);
      },
      error: async (err) => {
        console.error(err);
        let msg = 'Error creating teacher.';
        if (err.error?.username) msg = err.error.username;
        await this.showToast(msg, 'error');
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

  async showToast(message: string, type: 'success' | 'error' | 'warning') {
    let cssClass = '';
    let icon = '';

    switch (type) {
      case 'success':
        cssClass = 'toast-success';
        icon = 'checkmark-circle-outline';
        break;
      case 'error':
        cssClass = 'toast-error';
        icon = 'close-circle-outline';
        break;
      case 'warning':
        cssClass = 'toast-warning';
        icon = 'alert-circle-outline';
        break;
    }

    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: 'top',
      cssClass,
      icon,
      animated: true,
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }

  onDateChange(event: any) {
    this.teacher.date_of_birth = event.detail.value.split('T')[0];
  }
}
