import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTeachersPage } from './list-teachers.page';

describe('ListTeachersPage', () => {
  let component: ListTeachersPage;
  let fixture: ComponentFixture<ListTeachersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTeachersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
