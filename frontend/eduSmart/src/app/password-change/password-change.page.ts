import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController, IonButtons, IonLabel, IonItem, IonIcon, IonButton, IonInput, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from '../services/profile/profile';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.page.html',
  styleUrls: ['./password-change.page.scss'],
  standalone: true,
  imports: [IonContent,ReactiveFormsModule, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonLabel, IonItem,IonIcon,IonButton,IonInput,IonCard,IonCardContent,FormsModule]
})
export class PasswordChangePage  {

   passwordForm: FormGroup;
  loading = false;

  passwordCriteria = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  };

  constructor(
    private fb: FormBuilder,
    private profileService: Profile,
    private toastCtrl: ToastController
  ) {
    this.passwordForm = this.fb.group(
      {
        old_password: ['', Validators.required],
        new_password: [''],
        confirm_password: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.passwordForm.get('new_password')?.valueChanges.subscribe((password) => {
      this.checkPassword(password);
    });
  }

  checkPassword(password: string) {
    this.passwordCriteria.length = password?.length >= 8;
    this.passwordCriteria.upper = /[A-Z]/.test(password);
    this.passwordCriteria.lower = /[a-z]/.test(password);
    this.passwordCriteria.number = /[0-9]/.test(password);
    this.passwordCriteria.special = /[!@#$%]/.test(password);

    this.toggleRequirement('req-length', this.passwordCriteria.length);
    this.toggleRequirement('req-upper', this.passwordCriteria.upper);
    this.toggleRequirement('req-lower', this.passwordCriteria.lower);
    this.toggleRequirement('req-number', this.passwordCriteria.number);
    this.toggleRequirement('req-special', this.passwordCriteria.special);
  }

  toggleRequirement(id: string, valid: boolean) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle('active', valid); 
    }
  }


  passwordMatchValidator(form: FormGroup) {
    const newPwd = form.get('new_password')?.value;
    const confirmPwd = form.get('confirm_password')?.value;
    return newPwd === confirmPwd ? null : { passwordMismatch: true };
  }

 
  isPasswordValid(): boolean {
    return Object.values(this.passwordCriteria).every(v => v === true);
  }

  async changePassword() {
   
    if (!this.isPasswordValid() || this.passwordForm.hasError('passwordMismatch')) {
      this.showToast('Please check your input fields', 'warning');
      return;
    }

    const { old_password, new_password } = this.passwordForm.value;
    this.loading = true;

    this.profileService.changePassword(old_password, new_password).subscribe({
      next: async () => {
        this.loading = false;
        this.showToast('Password updated successfully!', 'success');
        this.passwordForm.reset();
        this.passwordCriteria = { length: false, upper: false, lower: false, number: false, special: false };
        ['req-length', 'req-upper', 'req-lower', 'req-number', 'req-special'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });
      },
      error: async (err) => {
        this.loading = false;
        const msg = err.error?.old_password || err.error?.detail || 'Invalid password. Try again.';
        this.showToast(msg, 'error');
      },
    });
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

  const toast = await this.toastCtrl.create({
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


  cancel() {
    this.passwordForm.reset();
    this.passwordCriteria = { length: false, upper: false, lower: false, number: false, special: false };
    ['req-length', 'req-upper', 'req-lower', 'req-number', 'req-special'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
  }
}