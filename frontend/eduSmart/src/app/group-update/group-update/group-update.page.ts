import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonInput,
  IonContent, IonSearchbar, IonBadge, LoadingController, ToastController,
  IonIcon,
  IonText,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group/group';
import { TeacherService } from 'src/app/services/teacher/teacher';
import { StudentService } from 'src/app/services/student/student-service';
import { Teacher } from 'src/app/models/teacher.models';
import { User } from 'src/app/models/user.models';
import { Group } from 'src/app/models/group.models';

@Component({
  selector: 'app-group-update',
  templateUrl: './group-update.page.html',
  styleUrls: ['./group-update.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonInput,
    IonSearchbar, IonBadge, IonButton, IonIcon, IonText
  ]
})
export class GroupUpdatePage implements OnInit {
  groupForm: FormGroup;
  groupId!: number;
  teachers: Teacher[] = [];
  students: User[] = [];
  selectedStudents: Set<number> = new Set();
  searchTerm: string = '';
  currentGroup!: Group;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      teacher: [null, Validators.required],
    });
  }

  async ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    this.loadTeachers();
    this.loadStudents();
    this.loadGroupDetails();
  }

  loadTeachers() {
    this.teacherService.listTeachers().subscribe({
      next: (data) => (this.teachers = data),
      error: (err) => console.error('Error loading teachers:', err),
    });
  }

  loadStudents() {
    this.studentService.listStudents().subscribe({
      next: (data) => (this.students = data),
      error: (err) => console.error('Error loading students:', err),
    });
  }

  loadGroupDetails() {
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => {
        this.currentGroup = group;
        this.groupForm.patchValue({
          name: group.name,
          description: group.description,
          teacher: group.teacher,
        });
        // Preselect students
        group.students.forEach((s: number) => this.selectedStudents.add(s));
      },
      error: (err) => console.error('Error loading group details:', err),
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
    if (!this.searchTerm.trim()) return this.students;
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(
      (student) =>
        student.first_name!.toLowerCase().includes(term) ||
        student.last_name!.toLowerCase().includes(term)
    );
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

  async updateGroup() {
    if (this.groupForm.invalid) {
      this.showToast('Please fill all required fields.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Updating group...',
      spinner: 'crescent',
    });
    await loading.present();

    const updatedData = {
      name: this.groupForm.value.name,
      description: this.groupForm.value.description,
      teacher: this.groupForm.value.teacher,
      students: Array.from(this.selectedStudents),
    };

    this.groupService.updateGroup(this.groupId, updatedData).subscribe({
      next: async () => {
        await loading.dismiss();
        this.showToast('Group updated successfully!', 'success');
        this.router.navigate(['/group']);
      },
      error: async (err) => {
        console.error(err);
        await loading.dismiss();
        this.showToast('Error updating group.', 'error');
      },
    });
  }

  getSelectedCount(): number {
    return this.selectedStudents.size;
  }
}