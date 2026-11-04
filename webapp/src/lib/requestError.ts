import axios from 'axios';
import toast from 'react-hot-toast';
/** UI boundary: services throw; event/effect handlers present failures to the user. */
export const reportRequestError = (error: unknown): void => {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  toast.error(status === 403 ? 'Недостаточно прав для этого действия.' :
    'Не удалось выполнить запрос. Повторите попытку.', { id: 'request-error' });
};
