import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursGroupPage } from './cours-group.page';

describe('CoursGroupPage', () => {
  let component: CoursGroupPage;
  let fixture: ComponentFixture<CoursGroupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
