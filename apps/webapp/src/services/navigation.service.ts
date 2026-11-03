import { axiosInstance } from "../API/axios.api";

export const NavigationService = {
  async getNavLinks() {
    try {
      const response = await axiosInstance.get(`navigation/getNavLinks`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  },
};
