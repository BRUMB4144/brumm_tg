export interface OptionM {
  text: string;
  _id: string;
}

export interface QuestionId {
  _id: string;
  text: string;
  options: OptionM[];
  hint: string;
  imageUrl?: string;
  category: string;
  questionNumber: number;
  videoUrl?: string;
}

export interface IQuestion {
  questionId: QuestionId;
  userAnswer: string | null;
  isCorrect: boolean | null;
  _id: string;
}

export interface IMarathon {
  _id: string;
  userId: string;
  questions: IQuestion[];
}

export interface Question {
  _id: string;
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
    _id: string;
  }[];
  hint?: string;
  imageUrl?: string;
  videoUrl?: string;
  category?: string;
  questionNumber: number;
}

export interface MarathonResponse {
  _id: string;
  userId: string;
  questions: IQuestion[];
  fullQuestions: Question[];
}

export interface MarathonResultQuestion {
  _id: string;
  isCorrect: boolean;
}

export interface MarathonResult {
  correctAnsweredQuestions: number;
  questionsComplete: number;
  totalQuestions: number;
  totalMistakes: number;
  mistakes: number;
  timeSpent: number;
  questionsProgress?: { answeredQuestions?: MarathonResultQuestion[] };
}
