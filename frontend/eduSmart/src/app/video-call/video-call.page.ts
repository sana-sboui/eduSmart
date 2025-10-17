import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';
declare var JitsiMeetExternalAPI: any;
import { Capacitor } from '@capacitor/core';
import { Jitsi } from 'capacitor-jitsi-meet';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.page.html',
  styleUrls: ['./video-call.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class VideoCallPage {
  // domain: string = 'meet.jit.si';
  // roomName: string =
  //   'teacher-student-session-' + Math.random().toString(36).substring(2, 15);
  // options: any;
  // api: any;
  // ngAfterViewInit() {
  //   this.options = {
  //     roomName: this.roomName,
  //     width: '100%',
  //     height: 600,
  //     parentNode: document.querySelector('#meet'),
  //     configOverwrite: {},
  //     interfaceConfigOverwrite: {},
  //     userInfo: {
  //       displayName: 'Teacher',
  //     },
  //   };
  //   this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  // }
  // ngOnDestroy() {
  //   if (this.api) {
  //     this.api.dispose();
  //   }
  // }
  ngOnInit() {
    const domain = 'meet.jit.si';
    const roomName = 'MyFreeVideoRoom123'; // any random name
    const iframe = document.getElementById('jitsiFrame') as HTMLIFrameElement;
    iframe.src = `https://${domain}/${roomName}#userInfo.displayName="Ionic User"`;
  }
}
