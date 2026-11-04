import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
export const useNotifications = (enabled = true) => {
  const cache = useQueryClient();
  const query = useQuery({ queryKey: ['notifications'], queryFn: userService.getNotifications, enabled });
  const remove = useMutation({
    mutationFn: userService.deleteNotification,
    onSuccess: () => cache.invalidateQueries({ queryKey: ['notifications'] }),
  });
  return { ...query, remove };
};
