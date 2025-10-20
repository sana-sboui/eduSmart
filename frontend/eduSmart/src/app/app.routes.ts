import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then( m => m.AuthPage)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'create-teacher',
    loadComponent: () =>
      import('./create-teacher/create-teacher.page').then(
        (m) => m.CreateTeacherPage
      ),
  },
  {
    path: 'list-teachers',
    loadComponent: () =>
      import('./list-teachers/list-teachers.page').then(
        (m) => m.ListTeachersPage
      ),
  },
  {
    path: 'update-teacher/:id',
    loadComponent: () =>
      import('./update-teacher/update-teacher.page').then(
        (m) => m.UpdateTeacherPage
      ),
  },
  {
    path: 'chat-group/:id',
    loadComponent: () =>
      import('./chat-group/chat-group.page').then((m) => m.ChatGroupPage),
  },
  {
    path: 'video-call',
    loadComponent: () => import('./video-call/video-call.page').then( m => m.VideoCallPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'password-change',
    loadComponent: () => import('./password-change/password-change.page').then( m => m.PasswordChangePage)
  },
  {
    path: 'create-teacher',
    loadComponent: () =>
      import('./create-teacher/create-teacher.page').then(
        (m) => m.CreateTeacherPage
      ),
  },
  {
    path: 'list-teachers',
    loadComponent: () =>
      import('./list-teachers/list-teachers.page').then(
        (m) => m.ListTeachersPage
      ),
  },
  {
    path: 'update-teacher/:id',
    loadComponent: () =>
      import('./update-teacher/update-teacher.page').then(
        (m) => m.UpdateTeacherPage
      ),
  },
  {
    path: 'group',
    loadComponent: () => import('./group/group.page').then( m => m.GroupPage)
  },
  {
    path: 'upload-cours',
    loadComponent: () => import('./upload-cours/upload-cours.page').then( m => m.UploadCoursPage)
  },
  {
    path: 'cours-liste',
    loadComponent: () => import('./cours-liste/cours-liste.page').then( m => m.CoursListePage)
  },
  {
    path: 'cours-group/:id',
    loadComponent: () => import('./cours-group/cours-group.page').then( m => m.CoursGroupPage)
  },

];