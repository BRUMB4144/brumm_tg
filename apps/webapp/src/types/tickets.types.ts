export interface ITicket {
  _id: string;
  number: number;
  questions: Question[];
}

export interface Question {
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
  _id?: string;
  text: string;
  isCorrect: boolean;
}

// Themes
export interface OptionTheme {
  text: string;
  isCorrect: boolean;
  _id: string;
}

export interface QuestionThemes {
  text: string;
  imageUrl: string;
  options: OptionTheme[];
  hint: string;
  videoUrl: string;
  category: string;
  questionNumber: number;
  _id: string;
}

export type ThemeQuestions = QuestionThemes[];

export interface ThemesItems {
  id: string;
  name: string;
  questions: number;
  thumbnail?: string;
}

export interface ThemeQuestion {
  text: string;
  imageUrl?: string;
  options: Option[];
  hint: string;
  videoUrl: string;
  category: string;
  questionNumber: number;
  _id: string;
}
