import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
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
    path: 'group',
    loadComponent: () => import('./group/group.page').then( m => m.GroupPage)
  },

];
