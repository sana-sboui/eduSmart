import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },

  {
    path: '',
    redirectTo: 'home',
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
    path: 'list-students',
    loadComponent: () =>
      import('./list-students/list-students.page').then(
        (m) => m.ListStudentsPage
      ),
  },
];
