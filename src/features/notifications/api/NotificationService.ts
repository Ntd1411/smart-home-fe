import { queryClient } from "@/shared/components/ReactQueryProvider";
import api from "@/shared/lib/api";
import API_ROUTES from "@/shared/lib/api-routes";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NotificationSeverity, NotificationType } from "@/shared/enums/notification.enum";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  location?: string;
  deviceId?: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: Date | string;
  emailSent: boolean;
  emailSentAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export interface UnreadCountResponse {
  count: number;
}

export const useGetNotificationsQuery = (unreadOnly: boolean = false) => {
  return useQuery({
    queryKey: ['notifications', unreadOnly],
    queryFn: async () => {
      const params = unreadOnly ? '?unreadOnly=true' : '';
      const res = await api.get<Notification[]>(`${API_ROUTES.NOTIFICATIONS}${params}`);
      return res.data;
    },
    refetchInterval: 30000, // Refetch mỗi 30s
  });
};

export const useGetUnreadCountQuery = () => {
  return useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: async () => {
      const res = await api.get<UnreadCountResponse>(`${API_ROUTES.NOTIFICATIONS}/unread-count`);
      return res.data.count;
    },
    refetchInterval: 30000, // Refetch mỗi 30s
  });
};

export const useMarkAsReadMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return api.patch(`${API_ROUTES.NOTIFICATIONS}/${id}/read`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể đánh dấu đã đọc");
    }
  });
};

export const useMarkAllAsReadMutation = () => {
  return useMutation({
    mutationFn: () => {
      return api.patch(`${API_ROUTES.NOTIFICATIONS}/mark-all-read`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể đánh dấu tất cả đã đọc");
    }
  });
};

export const useDeleteNotificationMutation = () => {
  return useMutation({
    mutationFn: (id: string) => {
      return api.delete(`${API_ROUTES.NOTIFICATIONS}/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
      toast.success("Đã xóa thông báo");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể xóa thông báo");
    }
  });
};
