import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonBadge, IonContent, IonIcon, IonText
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from 'src/app/services/group/group';
import { Group } from 'src/app/models/group.models';
import { User } from 'src/app/models/user.models';
import { Teacher } from 'src/app/models/teacher.models';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonBadge, IonIcon
  ]
})
export class GroupDetailsPage implements OnInit {
  groupId!: number;
  group!: Group;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.groupId = +this.route.snapshot.paramMap.get('id')!;
    this.loadGroup();
  }

  loadGroup() {
    this.groupService.getGroupById(this.groupId).subscribe({
      next: (group) => this.group = group,
      error: (err) => console.error('Error loading group details:', err)
    });
  }
}