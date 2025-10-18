import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonBadge, IonCardContent, IonIcon, LoadingController, ToastController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonSearchbar, IonCardHeader, IonSelectOption, IonSelect, IonLabel, IonText, IonInput, IonCardTitle, IonTextarea } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from 'src/app/services/teacher/teacher';
import { Teacher } from 'src/app/models/teacher.models';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.models';
import { StudentService } from 'src/app/services/student/student-service';
import { GroupService } from 'src/app/services/group/group';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.page.html',
  styleUrls: ['./group-create.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonItem, IonContent, CommonModule, FormsModule, IonButton, IonIcon, IonBadge, IonCard, IonCardContent, IonSearchbar, IonCardHeader, IonSelectOption, IonSelect, IonLabel, IonText, IonTextarea, IonInput, IonCardTitle, IonContent]
})
export class GroupCreatePage implements OnInit {
  groupForm: FormGroup;
  teachers: Teacher[] = [];
  students: User[] = [];
  selectedStudents: Set<number> = new Set();
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
    private groupService: GroupService
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      teacher: [null, Validators.required],
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

  ngOnInit() {
    this.loadTeachers();
    this.loadStudents();
  }

  loadTeachers() {
    this.teacherService.listTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
      },
    });
  }

  loadStudents() {
    this.studentService.listStudents().subscribe({
      next: (data) => {
        this.students = data;
        console.log('student: ', this.students)
      },
      error: (err) => {
        console.error('Error loading students:', err);
      },
    });
  }

  toggleStudentSelection(studentId: number) {
    if (this.selectedStudents.has(studentId)) {
      this.selectedStudents.delete(studentId);
    } else {
      this.selectedStudents.add(studentId);
    }
  }

  isStudentSelected(studentId: number): boolean {
    return this.selectedStudents.has(studentId);
  }

  get filteredStudents(): User[] {
    if (!this.searchTerm.trim()) {
      return this.students;
    }
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(student =>
      student.first_name!.toLowerCase().includes(term) ||
      student.last_name!.toLowerCase().includes(term)
    );
  }

  async createGroup() {
    if (this.selectedStudents.size < 2) {
      this.showToast('Please select at least two student', 'warning')
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating group...',
      spinner: 'crescent'
    });
    await loading.present();

    //Prepare group data
    const groupData = {
      name: this.groupForm.value.name,
      description: this.groupForm.value.description,
      teacher: this.groupForm.value.teacher,
      students: Array.from(this.selectedStudents)
    };

    console.log('Group data to submit:', groupData);

    this.groupService.createGroup(groupData).subscribe({
      next: async (data) => {
          await loading.dismiss();
        this.showToast('Group created successfully!', 'success');
        // this.groupForm.reset();
        // this.selectedStudents.clear();
        this.router.navigate(['/group'])
      },
      error: async (err) => {
        this.showToast('An error has occured please try again!', 'error');
      },
    });
  }

  getSelectedCount(): number {
    return this.selectedStudents.size;
  }
}