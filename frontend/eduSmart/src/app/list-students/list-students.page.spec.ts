import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListStudentsPage } from './list-students.page';

describe('ListStudentsPage', () => {
  let component: ListStudentsPage;
  let fixture: ComponentFixture<ListStudentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListStudentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
