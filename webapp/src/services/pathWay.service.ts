import { axiosInstance } from "../API/axios.api";

export const PathWay = {
  async getPathWays() {
    const response = await axiosInstance.get(`pathway`);
    return response.data;
  },
};
