import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<<< HEAD:frontend/eduSmart/src/app/list-students/list-students.page.spec.ts
import { ListStudentsPage } from './list-students.page';

describe('ListStudentsPage', () => {
  let component: ListStudentsPage;
  let fixture: ComponentFixture<ListStudentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStudentsPage);
========
import { GroupPage } from './group.page';

describe('GroupPage', () => {
  let component: GroupPage;
  let fixture: ComponentFixture<GroupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPage);
>>>>>>>> a4e27a74d677d3f415ffc2b6a6378b19bf81b380:frontend/eduSmart/src/app/group/group.page.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
