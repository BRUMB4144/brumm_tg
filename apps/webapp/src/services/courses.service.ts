import { axiosInstance } from "../API/axios.api";
import { ICourses, ILesson } from "../types/courses.types";

export const coursesService = {
  async fetchCourses() {
    try {
      const response = await axiosInstance.get<ICourses[]>("courses");
      return response.data;
    } catch {
      console.error("Error fetching courses");
    }
  },
  async getCourse(courseId: string) {
    try {
      const response = await axiosInstance.get<ICourses>(`courses/${courseId}`);
      return response.data;
    } catch {
      console.error("Error fetching course");
    }
  },
  async markChecked(courseId: string, lessonId: string) {
    try {
      const response = await axiosInstance.post(
        `courses/${courseId}/lessons/${lessonId}/watch`
      );
      return response.data;
    } catch {
      console.error("Error mark as check");
    }
  },
  async getLesson(courseId: string, lessonId: string) {
    try {
      const response = await axiosInstance.get<ILesson>(
        `courses/${courseId}/lessons/${lessonId}`
      );
      return response.data;
    } catch {
      console.error("Error fetching course");
    }
  },
  async getLessonPrev(courseId: string, lessonId: string) {
    try {
      const response = await axiosInstance.get<ILesson>(
        `courses/${courseId}/lessons/${lessonId}/prev-lesson`
      );
      return response.data;
    } catch {
      console.error("Error fetching course");
    }
  },
  async getLessonNext(courseId: string, lessonId: string) {
    try {
      const response = await axiosInstance.get<ILesson>(
        `courses/${courseId}/lessons/${lessonId}/next-lesson`
      );
      return response.data;
    } catch {
      console.error("Error fetching course");
    }
  },
};
