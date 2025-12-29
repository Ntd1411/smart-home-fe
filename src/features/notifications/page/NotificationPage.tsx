import { useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetUnreadCountQuery
} from "../api/NotificationService";
import { NotificationItem } from "../components/NotificationItem";

export const NotificationPage = () => {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data: notifications, isLoading, isFetching } = useGetNotificationsQuery(unreadOnly);
  const { data: unreadCount } = useGetUnreadCountQuery();
  const { mutateAsync: markAsRead } = useMarkAsReadMutation();
  const { mutateAsync: markAllAsRead } = useMarkAllAsReadMutation();
  const { mutateAsync: deleteNotification } = useDeleteNotificationMutation();

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn chắc chắn muốn xóa thông báo này?");
    if (!confirmed) return;
    await deleteNotification(id);
  };

  const handleMarkAllAsRead = async () => {
    if (!unreadCount || unreadCount === 0) return;
    const confirmed = window.confirm(`Đánh dấu tất cả ${unreadCount} thông báo là đã đọc?`);
    if (!confirmed) return;
    await markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-7 h-7 text-purple-600" />
          <h1 className="text-2xl font-bold tracking-tight">Thông báo</h1>
          {unreadCount !== undefined && unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={unreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            {unreadOnly ? "Hiển thị tất cả" : "Chưa đọc"}
          </Button>
          
          {unreadCount !== undefined && unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
      </div>

      {isFetching && !isLoading && (
        <div className="text-center text-sm text-gray-500 mb-4">
          <Loader2 className="animate-spin w-4 h-4 inline mr-2" />
          Đang cập nhật...
        </div>
      )}

      <div className="space-y-4">
        {!notifications || notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {unreadOnly ? "Không có thông báo chưa đọc" : "Không có thông báo nào"}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
