import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar, NavController, ToastController } from '@ionic/angular/standalone';
import { finalize } from 'rxjs';
import { Course } from '../models/course.model';
import { CoursesService } from '../services/courses/courses';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../models/group.models';
import { GroupService } from '../services/group/group';
import { Auth } from '../services/auth/auth';


@Component({
  selector: 'app-cours-edit',
  templateUrl: './cours-edit.page.html',
  styleUrls: ['./cours-edit.page.scss'],
  standalone: true,
  imports: [IonContent,IonIcon, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonCardContent,IonCard,IonItem,IonButton,ReactiveFormsModule,IonInput,IonTextarea,IonSelect,IonSelectOption]
})
export class CoursEditPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  courseForm!: FormGroup;
  selectedFile: File | null = null;
  uploadProgress = 0;
  loading = false;
  courseId!: number;
  currentCourse!: Course | null;
  groups: Group[] = [];
  teacherId = this.authService.getLoggedInUser()?.id;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private courseService: CoursesService,
    private toastCtrl:ToastController,
    private groupService: GroupService,
    private authService: Auth,
  ) {}

  /*ngOnInit() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      groups: [[], Validators.required],
    });

    // Récupérer id cours 
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.teacherId) {
      this.groupService.getGroupByUser(this.teacherId.toString()).subscribe({
        next: (res) => {
          this.groups = res;
          console.log('Groups loaded:', this.groups);
          if (this.groups.length > 0) {
      console.log('Type of g.id:', typeof this.groups[0].id); // 'number' or 'string'
    }
          if (this.courseId) this.loadCourse(this.courseId);
          
        },
        error: (err) => console.error('Erreur lors du chargement des groupes :', err)
      });
    }
  }

  loadCourse(id: number) {
    this.courseService.getCourse(id).subscribe({
      next: (course:Course) => {
        this.currentCourse = course;
        const selectedGroupIds = course.groups ? course.groups.map((g: any) =>Number (g.id)) : [];
        console.log('Type of g.id:', typeof selectedGroupIds[0]);
        this.courseForm.patchValue({
          title: course.title,
          description: course.description,
          groups: selectedGroupIds
          
        });
        
        console.log("gr:", this.groups.map((g: any) =>Number (g.id)))
      },
      error: (err:any) => console.error('Erreur lors du chargement du cours :', err)
    });
  }*/
 ngOnInit() {
  this.courseForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    groups: [[], Validators.required],
  });

  this.courseId = Number(this.route.snapshot.paramMap.get('id'));

  if (this.teacherId) {
    this.groupService.getGroupByUser(this.teacherId.toString()).subscribe({
      next: (res) => {
        this.groups = res;
        console.log('Groups loaded:', this.groups);

        if (this.courseId) this.loadCourse(this.courseId);
      },
      error: (err) => console.error(err)
    });
  }
}
loadCourse(id: number) {
  this.courseService.getCourse(id).subscribe({
    next: (course: Course) => {
      this.currentCourse = course;
      const selectedGroupIds = course.groups ? course.groups.map(g => Number(g)) : [];
      this.courseForm.patchValue({
        title: course.title,
        description: course.description,
        groups: selectedGroupIds
      });

      console.log('Selected group IDs:', selectedGroupIds);
    },
    error: (err) => console.error(err)
  });
}

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) {
      alert('Fichier trop volumineux (max 50 Mo)');
      return;
    }
    this.selectedFile = file;
  }

  updateCourse() {
    if (!this.courseForm.valid) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const { title, description,groups } = this.courseForm.value;
    const updatedCourse: Course = {
      id: this.courseId,
      title,
      description,
      file: this.selectedFile || this.currentCourse?.file,
      teacher: this.currentCourse?.teacher ||this.teacherId,
      groups: groups
    };

    this.loading = true;
    this.uploadProgress = 0;
   console.log("groupe:",groups)
    this.courseService.updateCourse(this.courseId, updatedCourse)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: async (res: any) => {
        console.log("liste:",updatedCourse)
        console.log('Course updated:', res);
        this.uploadProgress = 100;
        await this.showToast('Course updated successfully!', 'success');
        setTimeout(() => this.navCtrl.navigateBack('/cours-liste'), 1000);
      },
      error: async (err: any) => {
        console.error('Update error:', err);
        await this.showToast('Error while updating the course.', 'error');
      }
      });
  }

  cancel() {
    this.navCtrl.back();
  }

  // Helpers
  getFileIcon(file: File): string {
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return 'document-outline';
      case 'doc':
      case 'docx': return 'document-text-outline';
      case 'ppt':
      case 'pptx': return 'easel-outline';
      case 'zip':
      case 'rar': return 'archive-outline';
      default: return 'document-outline';
    }
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.uploadProgress = 0;
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

}
