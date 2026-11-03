import { axiosInstance } from "../API/axios.api";

export const PathWay = {
  async getPathWays() {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axiosInstance.get(`pathway`);
      return response.data;
    } catch {
      console.log("Ошибка при получении путей");
    }
  },
};
