import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useGetUnreadCountQuery
} from "../api/NotificationService";
import { NotificationItem } from "../components/NotificationItem";
import { FormPageLayout } from "@/shared/components/FormPageLayout";
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";

const NotificationPageComponent = () => {
  const PAGE_SIZE = 10;

  const getRoomLabel = (location: string) => {
    const normalized = (location || "").trim();
    switch (normalized) {
      case "living-room":
        return "Phòng khách";
      case "bedroom":
        return "Phòng ngủ";
      case "kitchen":
        return "Nhà bếp";
      case "bathroom":
        return "Phòng tắm";
      default:
        return normalized || "Không rõ";
    }
  };

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [locationFilter, setLocationFilter] = useState<"all" | string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const {
    data: notifications,
    isLoading,
    isFetching,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(unreadOnly);
  const {
    data: unreadCount,
    isFetching: isUnreadCountFetching,
    refetch: refetchUnreadCount,
  } = useGetUnreadCountQuery();
  const { mutateAsync: markAsRead } = useMarkAsReadMutation();
  const { mutateAsync: markAllAsRead } = useMarkAllAsReadMutation();
  const { mutateAsync: deleteNotification } = useDeleteNotificationMutation();

  const isRefreshing = isFetching || isUnreadCountFetching;

  const locationOptions = useMemo(() => {
    const unknownValue = "__unknown__";
    if (!notifications || notifications.length === 0) {
      return { values: [] as string[], unknownValue };
    }

    const set = new Set<string>();
    let hasUnknown = false;

    for (const n of notifications) {
      const location = (n.location || "").trim();
      if (!location) {
        hasUnknown = true;
        continue;
      }
      set.add(location);
    }

    const values = Array.from(set).sort((a, b) => a.localeCompare(b));
    if (hasUnknown) values.unshift(unknownValue);
    return { values, unknownValue };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    const query = search.trim().toLowerCase();
    return notifications.filter((n) => {
      if (locationFilter !== "all") {
        if (locationFilter === locationOptions.unknownValue) {
          if (n.location) return false;
        } else {
          if ((n.location || "") !== locationFilter) return false;
        }
      }

      if (query) {
        const haystack = `${n.title || ""} ${n.message || ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [notifications, locationFilter, locationOptions.unknownValue, search]);

  useEffect(() => {
    setPage(1);
  }, [locationFilter, search, unreadOnly]);

  const pagination = useMemo(() => {
    const total = filteredNotifications.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page), totalPages);

    const start = (safePage - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, total);

    return {
      total,
      totalPages,
      page: safePage,
      start,
      end,
      items: filteredNotifications.slice(start, end),
    };
  }, [PAGE_SIZE, filteredNotifications, page]);

  useEffect(() => {
    if (page !== pagination.page) {
      setPage(pagination.page);
    }
  }, [page, pagination.page]);

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

  const handleRefresh = async () => {
    await Promise.all([refetchNotifications(), refetchUnreadCount()]);
  };

  if (isLoading) {
    return (
      <FormPageLayout
        title="Thông báo"
        description="Theo dõi và quản lý thông báo trong hệ thống"
      >
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      </FormPageLayout>
    );
  }

  return (
    <FormPageLayout
      title="Thông báo"
      description="Theo dõi và quản lý thông báo trong hệ thống"
    >
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={locationFilter} onValueChange={(v) => setLocationFilter(v)}>
              <SelectTrigger className="w-44" aria-label="Lọc theo phòng">
                <SelectValue placeholder="Phòng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phòng</SelectItem>
                {locationOptions.values.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc === locationOptions.unknownValue ? "Không rõ" : getRoomLabel(loc)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm (tiêu đề / nội dung)"
              className="w-64"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={"w-4 h-4 mr-2" + (isRefreshing ? " animate-spin" : "")} />
            Làm mới
          </Button>

          <Button
            variant={unreadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setUnreadOnly(!unreadOnly)}
          >
            {unreadOnly ? "Hiển thị tất cả" : "Chưa đọc"}
          </Button>
          
          {unreadCount !== undefined && unreadCount > 0 && (
            <ComponentWithPermissionGuard permission={PERMISSIONS.NOTIFICATIONS.MARK_ALL_AS_READ}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Đánh dấu tất cả đã đọc
              </Button>
            </ComponentWithPermissionGuard>
          )}
        </div>

        {isRefreshing && !isLoading && (
          <div className="text-center text-sm text-gray-500 mb-4">
            <Loader2 className="animate-spin w-4 h-4 inline mr-2" />
            Đang cập nhật...
          </div>
        )}

        <div className="space-y-4">
          {!notifications || filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {unreadOnly ? "Không có thông báo chưa đọc" : "Không có thông báo nào"}
              </p>
            </div>
          ) : (
            pagination.items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-6">
            <div className="text-sm text-gray-500">
              Hiển thị {pagination.total === 0 ? 0 : pagination.start + 1}-{pagination.end} / {pagination.total}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
              >
                Trước
              </Button>
              <div className="text-sm text-gray-500">
                Trang {pagination.page} / {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
    </FormPageLayout>
  );
};

export const NotificationPage = withPermissionGuard(
  NotificationPageComponent,
  PERMISSIONS.NOTIFICATIONS.LIST
);
