import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonButton,IonHeader, IonButtons, IonContent, IonIcon, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Question, Quiz } from '../models/quiz.models';
import { QuizService } from '../services/quiz/quiz';
import { Auth } from '../services/auth/auth';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
  standalone: true,
  imports: [CommonModule,IonButton,IonIcon,IonContent ]  
})
export class QuizPage implements OnInit {

 quiz: Quiz | null = null;
  quizData: Question[] = [];
  userAnswers: { [key: number]: number } = {};
  quizSubmitted = false;

  quizResult: {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    percentage: number;
  } | null = null;

  constructor(private quizService: QuizService,private authService: Auth) {}

  ngOnInit() {
    const courseId = 1; 
    this.loadQuiz(courseId);
  }

  loadQuiz(id: number) {
    this.quizService.getQuiz(id).subscribe({
      next: (data) => {
        this.quiz = data;
        this.quizData = data.questions;
      },
      error: (err) => console.error('Error loading quiz:', err)
    });
  }

  selectOption(questionId: number, optionId: number) {
    if (this.quizSubmitted) return;
    this.userAnswers[questionId] = optionId;
  }

  isOptionSelected(questionId: number, optionId: number): boolean {
    return this.userAnswers[questionId] === optionId;
  }

  isOptionCorrect(questionId: number, optionId: number): boolean {
    if (!this.quizSubmitted) return false;
    const q = this.quizData.find(q => q.id === questionId);
    return q?.options.find(o => o.id === optionId)?.isCorrect ?? false;
  }

  isOptionIncorrect(questionId: number, optionId: number): boolean {
    if (!this.quizSubmitted) return false;

    const q = this.quizData.find(q => q.id === questionId);
    const option = q?.options.find(o => o.id === optionId);

    return this.userAnswers[questionId] === optionId && !!option && option.isCorrect === false;

  }

  get allQuestionsAnswered(): boolean {
    return Object.keys(this.userAnswers).length === this.quizData.length;
  }

  submitQuiz() {
  if (this.quizSubmitted || !this.allQuestionsAnswered) return;

  this.quizSubmitted = true;

  const correctAnswers = this.quizData.filter(q => {
    const selectedId = this.userAnswers[q.id];
    const selectedOption = q.options.find(o => o.id === selectedId);
    return selectedOption?.isCorrect;
  }).length;

  const totalQuestions = this.quizData.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  this.quizResult = {
    score: percentage,
    correctAnswers,
    totalQuestions,
    percentage
  };

  
  const studentId = this.authService.getLoggedInUser()?.id;; 
  const quizId = this.quiz?.id;

  if (studentId !== undefined && quizId !== undefined) {
    this.quizService.saveStudentResult({
      student: studentId,
      quiz: quizId,
      correct_answers: correctAnswers,
      incorrect_answers: totalQuestions - correctAnswers,
      percentage: percentage
    }).subscribe({
      next: (res) => console.log('Résultat sauvegardé:', res),
      error: (err) => console.error('Erreur sauvegarde résultat:', err)
    });
  }
}


  resetQuiz() {
    this.userAnswers = {};
    this.quizSubmitted = false;
    this.quizResult = null;
  }

  getQuestionStatus(questionId: number): string {
    if (!this.quizSubmitted) return "";

    const question = this.quizData.find(q => q.id === questionId);
    const selectedId = this.userAnswers[questionId];

    const selected = question?.options.find(o => o.id === selectedId);
    return selected?.isCorrect ? "correct" : "incorrect";
  }
}
