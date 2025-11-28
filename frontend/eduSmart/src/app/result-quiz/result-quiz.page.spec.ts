import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultQuizPage } from './result-quiz.page';

describe('ResultQuizPage', () => {
  let component: ResultQuizPage;
  let fixture: ComponentFixture<ResultQuizPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
