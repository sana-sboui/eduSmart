import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateTeacherPage } from './update-teacher.page';

describe('UpdateTeacherPage', () => {
  let component: UpdateTeacherPage;
  let fixture: ComponentFixture<UpdateTeacherPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTeacherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
