export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  questionType: string;
  options: Option[];
}

export interface Quiz {
  id: number;
  title: string;
  course: number;
  questions: Question[];
}
export interface StudentQuizResult {
  id?: number;
  student: number;
  quiz: number;
  correct_answers: number;
  incorrect_answers: number;
  percentage: number;
  submission_date?: string;
}
