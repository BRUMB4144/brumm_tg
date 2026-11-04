import { axiosInstance } from "../API/axios.api";

export const NavigationService = {
  async getNavLinks() {
    const response = await axiosInstance.get(`navigation/getNavLinks`);
    return response.data;
  },
};
