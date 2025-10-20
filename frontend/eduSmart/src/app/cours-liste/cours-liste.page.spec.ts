import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursListePage } from './cours-liste.page';

describe('CoursListePage', () => {
  let component: CoursListePage;
  let fixture: ComponentFixture<CoursListePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursListePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
