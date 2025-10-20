import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadCoursPage } from './upload-cours.page';

describe('UploadCoursPage', () => {
  let component: UploadCoursPage;
  let fixture: ComponentFixture<UploadCoursPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCoursPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
