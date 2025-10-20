import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CoursesService } from '../services/courses/courses';
import { Course } from '../models/course.model';
import { finalize } from 'rxjs';
import { GroupService } from '../services/group/group';
import { Group } from '../models/group.models';
import { Auth } from '../services/auth/auth';

@Component({
  selector: 'app-upload-cours',
  templateUrl: './upload-cours.page.html',
  styleUrls: ['./upload-cours.page.scss'],
  standalone: true,
  imports: [IonContent,IonInput,IonTextarea, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonIcon,IonCard,IonCardContent,IonItem,IonButton,ReactiveFormsModule,IonSelectOption,IonSelect]
})
export class UploadCoursPage  {

   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  courseForm: FormGroup;
  selectedFile: File | null = null;
  uploadProgress = 0;
  loading = false;
  maxFileSize = 50 * 1024 * 1024; 
  groups: Group[] = [];
  teacherId =this.authService.getLoggedInUser()?.id; 

  constructor(private fb: FormBuilder, private courseService: CoursesService,private groupService: GroupService,private authService:Auth) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      groups: [[], Validators.required],
    });
  }
  ngOnInit() {
    if (this.teacherId !== undefined) {
  this.groupService.getGroupByUser(this.teacherId.toString()).subscribe({
    next: (res) => {
      this.groups = res;
      console.log('Groups loaded:', this.groups);
    },
    error: (err) => console.error('Error fetching groups:', err)
  });
}
}

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        console.error('⚠️ File too large');
        return;
      }
      this.selectedFile = file;
    }
  }

    uploadCourse() {
    if ( !this.courseForm.valid ||!this.selectedFile) {
      alert('Please fill all required fields and select a file.');
      return;
    }

    const { title, description,groups} = this.courseForm.value;

    const course: Course = {
      title,
      description,
      file: this.selectedFile,
      teacher:this.teacherId, 
      groups: groups,
    };

    this.loading = true;
    this.uploadProgress = 0;
    console.log("zzz",course)
    this.courseService.createCourse(course)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (res) => {
          console.log('Course created successfully:', res);
          this.uploadProgress = 100;
          setTimeout(() => {
            this.courseForm.reset();
            this.selectedFile = null;
            this.uploadProgress = 0;
          }, 2000);
        },
        error: (err) => {
          console.error('Error uploading course:', err);
          alert('Upload failed. Please try again.');
        }
      });
  }
  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
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
  cancel() {
  this.courseForm.reset();
  this.selectedFile = null;
  this.uploadProgress = 0;
}
}