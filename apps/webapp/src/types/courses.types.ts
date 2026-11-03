export interface ICourses {
  _id: string;
  title: string;
  description: string;
  category: string;
  lessons: Lesson[];
  createdAt: string;
  progress: Progress;
  subscription: boolean;
  lastOpen: ILastOpen;
}
export interface ILastOpen {
  name: string;
  lessonId: string;
  courseId: string;
}
export interface Lesson {
  _id: string;
  title: string;
  description: string;
  videoUrl: string[];
  additionalFiles: AdditionalFile[];
  order: number;
  thumbnail: string;
  courseTitle: string;
  isWatched?: boolean;
}

export interface AdditionalFile {
  name: string;
  url: string;
}

export interface Progress {
  lastStudiedLesson: string;
  lessonsCompleted: number;
  isWatched: boolean;
  percentage?: number;
}

export interface Option {
  _id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  text: string;
  category: string;
  hint: string;
  imageUrl: string;
  options: Option[];
  questionNumber: number;
  videoUrl: string;
  _id: string;
}

export interface TicketItem {
  _id: string;
  number: number;
  questions: Question[];
  videoUrl: string;
}

export interface ILesson {
  _id: string;
  title: string;
  description: string;
  videoUrl: string[];
  additionalFiles: AdditionalFile[];
  order: number;
  courseTitle: string;
  progress: Progress;
}

export interface AdditionalFile {
  name: string;
  url: string;
}

export interface Progress {
  lessonId: string;
  isCompleted: boolean;
  homeworkSubmitted: boolean;
  homeworkData: string;
}
//
