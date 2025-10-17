import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonItem, IonLabel, IonIcon,IonText, IonButton, IonButtons, IonBackButton, IonDatetimeButton,IonDatetime,IonModal,IonInput, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular';
import { Profile } from '../services/profile/profile';
import { Photos } from '../services/photos';




@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonIcon,  IonText, IonButton, IonButtons, IonBackButton, IonDatetimeButton,IonDatetime,IonModal,IonInput,IonSelectOption,IonSelect]
})
export class ProfilePage implements OnInit  {

  isEditing = false;
  profile: any = {};        
  role: string = '';
  editProfile: any;
  maxDate: string = new Date().toISOString().split('T')[0];
  originalProfilePicture: string | null = null;
  statusChoices: [string, string][] = [
  ['STUDENT', 'Student'],
  ['EMPLOYEE', 'Employee'],
  ['OTHER', 'Other'],
];
statusSelectOptions = {
  header: 'Select Status',
  translucent: true,
};
  constructor(private profileService: Profile,private photoSer: Photos, private actionSheetCtrl: ActionSheetController,) {}

  ngOnInit() {
    this.loadProfile();
  }

 loadProfile() {
  this.profileService.getProfile().subscribe({
    next: (res) => {
      const data: any = res;
      

      if (data.user) {
        this.profile = { ...data.user, ...data }; 
        this.role = data.user.role;
      } else {
        this.profile = { ...data };
        this.role = data.role;       
      }
      console.log("data"+this.profile.profile_picture)

    },
    error: (err) => console.error('Failed to load profile', err)
  });
}



 toggleEditMode() {
  if (this.isEditing) {
    this.saveProfile(); 
  } else {
    this.editProfile = { ...this.profile }; 
  }
  this.isEditing = !this.isEditing;
}
  cancel() {
  this.isEditing = false;
  this.editProfile = null;
  this.loadProfile(); 
}
saveProfile() {
  this.profileService.updateProfile(this.editProfile).subscribe({
    next: (res) => {
      console.log('Profile updated:', res);
      this.profile = {...res};
      this.isEditing = false;
      this.editProfile = null;
    },
    error: (err) => console.error('Update failed:', err)
  });
}

  getInitials() {
    if (this.profile.first_name && this.profile.last_name)
      return (this.profile.first_name.charAt(0) + this.profile.last_name.charAt(0)).toUpperCase();
    return '';
  }


  async changeAvatar() {
  const photo = await this.photoSer.takePicture();
  if (photo) {
        this.editProfile.profile_picture = photo; 
    }
}

 onDateChange(event: any) {
  const dateValue = event.detail.value; 
  if (dateValue && this.editProfile) {
    this.editProfile.date_of_birth = dateValue.split('T')[0]; 
  }
}

  async presentActionSheet() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Ajouter une photo',
    buttons: [
      {
        text: 'Prendre une photo',
        icon: 'camera',
        handler: async () => {
          const photo = await this.photoSer.takePicture();
          if(photo) this.editProfile.profile_picture = photo;
        }
      },
      {
        text: 'Choisir depuis la galerie',
        icon: 'image',
        handler: async () => {
          const photo = await this.photoSer.pickPicture();
          if(photo) this.editProfile.profile_picture = photo;
        }
      },
      {
        text: 'Annuler',
        icon: 'close',
        role: 'cancel'
      }
    ]
  });

  await actionSheet.present();
}


}
