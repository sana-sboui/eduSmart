import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursEditPage } from './cours-edit.page';

describe('CoursEditPage', () => {
  let component: CoursEditPage;
  let fixture: ComponentFixture<CoursEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
