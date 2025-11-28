import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz, StudentQuizResult } from 'src/app/models/quiz.models';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://127.0.0.1:8000/quiz/quiz/';
  private resultApiUrl = 'http://127.0.0.1:8000/quiz/student-quiz-result/';

  constructor(private http: HttpClient) {}

  getQuiz(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}${id}/`);
  }
  saveStudentResult(result: StudentQuizResult): Observable<StudentQuizResult> {
    return this.http.post<StudentQuizResult>(this.resultApiUrl, result);
  }
}
