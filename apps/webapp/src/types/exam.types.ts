export interface IAnswer {
  questionIndex: number;
  userAnswer: number;
}

export interface IExamStatus {
  exam: {
    _id: string;
    userId: string;
    ticketNumber: number;
    questions: {
      questionId: string; // Changed to string
      text: string;
      options: {
        text: string;
        _id: string;
        isCorrect?: boolean;
      }[];
      hint?: string;
      imageUrl?: string;
      videoUrl?: string;
      category?: string;
      questionNumber: number;
      sourceTicketNumber?: number;
      userAnswer: number | null;
      isCorrect: boolean | null;
      _id: string;
    }[];
    extraQuestions: any[];
    mistakes: number;
    status: string;
    startTime: string;
    timeLimit: number;
    extraTime: number;
    mistakesDetails: any[];
    __v: number;
  };
  statistics: {
    totalQuestions: number;
    correctAnswers: number;
    mistakes: number;
    timeSpent: number;
    status: string;
    completedAt: string | null;
  };
}
export interface Exam {
  _id: string;
  userId: string;
  ticketNumber: number;
  questions: Question[];
  extraQuestions: ExtraQuestion[];
  mistakes: number;
  status: string;
  startTime: string;
  timeLimit: number;
  extraTime: number;
}

export interface Question {
  questionId: QuestionId;
  userAnswer: number;
  isCorrect: boolean;
  sourceTicketNumber?: number;
}

export interface QuestionId {
  _id: string;
  text: string;
  imageUrl: string;
  options: Option[];
  hint: string;
  videoUrl: string;
  category: string;
  questionNumber: number;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface ExtraQuestion {
  questionId: QuestionId2;
  userAnswer: number;
  isCorrect: boolean;
}

export interface QuestionId2 {
  _id: string;
  text: string;
  imageUrl: string;
  options: Option2[];
  hint: string;
  videoUrl: string;
  category: string;
}

export interface Option2 {
  text: string;
  isCorrect: boolean;
}

export interface Statistics {
  totalQuestions: number;
  correctAnswers: number;
  mistakes: number;
  timeSpent: number;
  status: string;
}

export interface IShare {
  type: string;
  template: string;
  data: IShareData;
  shareOptions: string[];
}

export interface IShareData {
  score: number;
  total: number;
  mistakes: number;
  time: number;
}

export interface ITicket {
  ticketId: string;
  message: string;
}
