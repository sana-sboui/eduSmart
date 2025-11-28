import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonSelect, IonSelectOption, IonTitle, IonToolbar, } from '@ionic/angular/standalone';
interface StudentResult {
  name: string;
  email: string;
  correct: number;
  incorrect: number;
  total: number;
}

interface QuizStats {
  totalStudents: number;
  avgCorrect: number;
  avgIncorrect: number;
  highestScore: number;
  classAverage: number;
}
@Component({
  selector: 'app-result-quiz',
  templateUrl: './result-quiz.page.html',
  styleUrls: ['./result-quiz.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonIcon,IonSelect,IonSelectOption,IonButton,IonButtons,IonItem,IonLabel]
})
export class ResultQuizPage implements OnInit {

    students: StudentResult[] = [
    { name: "Alice Johnson", email: "alice.j@school.edu", correct: 9, incorrect: 1, total: 10 },
    { name: "Bob Smith", email: "bob.s@school.edu", correct: 7, incorrect: 3, total: 10 },
    { name: "Charlie Brown", email: "charlie.b@school.edu", correct: 8, incorrect: 2, total: 10 },
    { name: "Diana Prince", email: "diana.p@school.edu", correct: 10, incorrect: 0, total: 10 },
    { name: "Ethan Hunt", email: "ethan.h@school.edu", correct: 6, incorrect: 4, total: 10 },
    { name: "Fiona Green", email: "fiona.g@school.edu", correct: 8, incorrect: 2, total: 10 },
    { name: "George Wilson", email: "george.w@school.edu", correct: 5, incorrect: 5, total: 10 },
    { name: "Hannah Lee", email: "hannah.l@school.edu", correct: 9, incorrect: 1, total: 10 }
  ];

  stats: QuizStats = {
    totalStudents: 0,
    avgCorrect: 0,
    avgIncorrect: 0,
    highestScore: 0,
    classAverage: 0
  };

  sortedStudents: StudentResult[] = [];
  sortBy: string = 'score-desc';

  ngOnInit() {
    this.calculateStats();
    this.sortStudents('score-desc');
  }

  calculatePercentage(correct: number, total: number): number {
    return Math.round((correct / total) * 100);
  }

  getScoreClass(percentage: number): string {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'average';
    return 'poor';
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  calculateStats(): void {
    this.stats.totalStudents = this.students.length;
    const totalCorrect = this.students.reduce((sum, s) => sum + s.correct, 0);
    const totalIncorrect = this.students.reduce((sum, s) => sum + s.incorrect, 0);
    
    this.stats.avgCorrect = Math.round(totalCorrect / this.stats.totalStudents);
    this.stats.avgIncorrect = Math.round(totalIncorrect / this.stats.totalStudents);
    this.stats.highestScore = Math.max(...this.students.map(s => this.calculatePercentage(s.correct, s.total)));
    this.stats.classAverage = Math.round((totalCorrect / (this.stats.totalStudents * this.students[0].total)) * 100);
  }

  sortStudents(sortBy: string): void {
    this.sortBy = sortBy;
    
    switch(sortBy) {
      case 'name':
        this.sortedStudents = [...this.students].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'score-desc':
        this.sortedStudents = [...this.students].sort((a, b) => {
          const percentA = this.calculatePercentage(a.correct, a.total);
          const percentB = this.calculatePercentage(b.correct, b.total);
          return percentB - percentA;
        });
        break;
      case 'score-asc':
        this.sortedStudents = [...this.students].sort((a, b) => {
          const percentA = this.calculatePercentage(a.correct, a.total);
          const percentB = this.calculatePercentage(b.correct, b.total);
          return percentA - percentB;
        });
        break;
      default:
        this.sortedStudents = [...this.students];
    }
  }

  onSortChange(event: any): void {
    this.sortStudents(event.detail.value);
  }

  exportResults(): void {
    // Implémentation de l'exportation des résultats
    console.log('Exporting results...');
    // Ici vous pouvez ajouter la logique pour exporter en CSV ou PDF
  }
}
