import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupUpdatePage } from './group-update.page';

describe('GroupUpdatePage', () => {
  let component: GroupUpdatePage;
  let fixture: ComponentFixture<GroupUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
