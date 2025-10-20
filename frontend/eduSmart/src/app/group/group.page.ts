import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonCard, IonContent, IonAlert } from '@ionic/angular/standalone';
import { Group } from '../models/group.models';
import { GroupService } from '../services/group/group';
import { Router } from '@angular/router';
import { colorFilterOutline } from 'ionicons/icons';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonCard, IonIcon, IonButton, IonContent, IonAlert],
})
export class GroupPage implements OnInit {

  groups: Group[] = [];
  loading = true;

  constructor(private groupService: GroupService, private router: Router) {}

  ngOnInit() {
    this.loadGroups();
  }

  ionViewWillEnter() {
    this.loadGroups();
  }

  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: (data) => {
        this.groups = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  viewGroup(id: number) {
    this.router.navigate([`group-details/${id}`])
  }

  updateGroup(id: number) {
    this.router.navigate([`group-update/${id}`])
  }

  deleteGroup(id: number) {
    console.log('Delete group:', id);
    this.groupService.deleteGroup(id).subscribe({
      next: () => {
        console.log("Deleted")
        this.loadGroups();
      },
      error: (err) => {
        console.error('Error deleting group:', err);
      }
    });
  }

  createGroup() {
    this.router.navigate(['group-create'])
  }

  alertButtons(groupId: number) {
    return [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
          this.deleteGroup(groupId);
        },
      },
    ];
  }
}
