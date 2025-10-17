import { Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonItem, IonBadge, IonCardContent, IonIcon, LoadingController, ToastController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonSearchbar, IonCardHeader, IonSelectOption, IonSelect, IonLabel, IonText, IonInput, IonCardTitle, IonTextarea } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from 'src/app/services/teacher/teacher';
import { Teacher } from 'src/app/models/teacher.models';
import { Router } from '@angular/router';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  profile_photo?: string;
}

interface Group {
  id: number;
  name: string;
  description: string;
  teacher: number;
  students: number[];
  teacher_detail: Teacher;
  students_detail: User[];
}

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
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router,
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      teacher: [null, Validators.required],
    });
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
    // Mock data - replace with actual API call
    this.students = [
      {
        id: 1,
        first_name: 'Alice',
        last_name: 'Williams',
        email: 'alice.w@student.com',
        status: 'active',
        profile_photo: 'https://i.pravatar.cc/150?img=10'
      },
      {
        id: 2,
        first_name: 'Bob',
        last_name: 'Brown',
        email: 'bob.b@student.com',
        status: 'active',
        profile_photo: 'https://i.pravatar.cc/150?img=11'
      },
      {
        id: 3,
        first_name: 'Charlie',
        last_name: 'Davis',
        email: 'charlie.d@student.com',
        status: 'pending',
        profile_photo: 'https://i.pravatar.cc/150?img=12'
      },
      {
        id: 4,
        first_name: 'Diana',
        last_name: 'Miller',
        email: 'diana.m@student.com',
        status: 'active',
        profile_photo: 'https://i.pravatar.cc/150?img=13'
      },
      {
        id: 5,
        first_name: 'Edward',
        last_name: 'Wilson',
        email: 'edward.w@student.com',
        status: 'inactive',
        profile_photo: 'https://i.pravatar.cc/150?img=14'
      },
      {
        id: 6,
        first_name: 'Fiona',
        last_name: 'Moore',
        email: 'fiona.m@student.com',
        status: 'active',
        profile_photo: 'https://i.pravatar.cc/150?img=15'
      }
    ];
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
      student.first_name.toLowerCase().includes(term) ||
      student.last_name.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term)
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Employee':
        return 'success';
      case 'Student':
        return 'medium';
      case 'Other':
        return 'warning';
      default:
        return 'medium';
    }
  }

  async createGroup() {
    const groupData = {
      name: this.groupForm.value.name,
      description: this.groupForm.value.description,
      teacher: this.groupForm.value.teacher,
      students: Array.from(this.selectedStudents)
    };
    console.log('Group data to submit:', groupData);
    if (this.groupForm.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Please fill in all required fields',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
      return;
    }

    if (this.selectedStudents.size === 0) {
      const toast = await this.toastCtrl.create({
        message: 'Please select at least one student',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating group...',
      spinner: 'crescent'
    });
    await loading.present();

    // Prepare group data
    // const groupData = {
    //   name: this.groupForm.value.name,
    //   description: this.groupForm.value.description,
    //   teacher: this.groupForm.value.teacher,
    //   students: Array.from(this.selectedStudents)
    // };

    console.log('Group data to submit:', groupData);

    // Simulate API call
    setTimeout(async () => {
      await loading.dismiss();
      
      const toast = await this.toastCtrl.create({
        message: 'Group created successfully!',
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      toast.present();

      // Reset form
      this.groupForm.reset();
      this.selectedStudents.clear();
    }, 1500);
  }


  getSelectedCount(): number {
    return this.selectedStudents.size;
  }
}