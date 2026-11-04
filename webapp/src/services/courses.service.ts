import axios from 'axios';
import { axiosInstance } from "../API/axios.api";
import { ICourses, ILesson } from "../types/courses.types";

// A course boundary is valid empty data; missing courses and outages remain errors.
const adjacentLesson = async (path: string, emptyMessage: string): Promise<ILesson | null> => {
  try { return (await axiosInstance.get<ILesson>(path)).data; }
  catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404 && error.response.data?.message === emptyMessage) return null;
    throw error;
  }
};

export const coursesService = {
  async fetchCourses() {
    const response = await axiosInstance.get<ICourses[]>("courses");
    return response.data;
  },
  async getCourse(courseId: string) {
    const response = await axiosInstance.get<ICourses>(`courses/${courseId}`);
    return response.data;
  },
  async markChecked(courseId: string, lessonId: string) {
    const response = await axiosInstance.post(
      `courses/${courseId}/lessons/${lessonId}/watch`
    );
    return response.data;
  },
  async getLesson(courseId: string, lessonId: string) {
    const response = await axiosInstance.get<ILesson>(
      `courses/${courseId}/lessons/${lessonId}`
    );
    return response.data;
  },
  getLessonPrev(courseId: string, lessonId: string) {
    return adjacentLesson(`courses/${courseId}/lessons/${lessonId}/prev-lesson`, 'No previous lesson available');
  },
  getLessonNext(courseId: string, lessonId: string) {
    return adjacentLesson(`courses/${courseId}/lessons/${lessonId}/next-lesson`, 'No next lesson available');
  },
};
