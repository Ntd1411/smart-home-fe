import { useId, useState } from "react";
import { Bell, CheckCheck, Mail, Trash2, AlertTriangle, Info, Shield, ChevronDown } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { NotificationSeverity, NotificationType } from "@/shared/enums/notification.enum";
import type { Notification } from "../api/NotificationService";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem = ({ notification, onMarkAsRead, onDelete }: NotificationItemProps) => {
  const [openDetail, setOpenDetail] = useState(false);
  const detailId = useId();

  const formatDate = (value?: Date | string) => {
    if (!value) return "---";
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleString("vi-VN", { 
      timeZone: 'Asia/Ho_Chi_Minh',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const hasMetadata =
    !!notification.metadata && Object.keys(notification.metadata).length > 0;

  const formatKey = (key: string): string => {
    const keyMap: Record<string, string> = {
      failedAttempts: 'Số lần thử',
      firstAttemptTime: 'Thời gian thử đầu',
      lastAttemptTime: 'Thời gian thử cuối',
      deviceId: 'Thiết bị',
      location: 'Vị trí',
      ipAddress: 'Địa chỉ IP',
    };

    return keyMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const formatValue = (value: unknown): string => {
    if (value instanceof Date) {
      return value.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    }

    if (typeof value === 'string') {
      const ms = Date.parse(value);
      if (!Number.isNaN(ms) && (value.includes('T') || value.includes('-') || value.includes('/'))) {
        return new Date(ms).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      }
      return value;
    }

    return String(value);
  };

  const getSeverityStripe = (severity: NotificationSeverity) => {
    switch (severity) {
      case NotificationSeverity.CRITICAL: return 'border-l-red-500';
      case NotificationSeverity.HIGH: return 'border-l-orange-500';
      case NotificationSeverity.MEDIUM: return 'border-l-yellow-500';
      case NotificationSeverity.LOW: return 'border-l-blue-500';
      default: return 'border-l-gray-400';
    }
  };

  const getSeverityBg = (severity: NotificationSeverity) => {
    switch (severity) {
      case NotificationSeverity.CRITICAL: return 'bg-red-50';
      case NotificationSeverity.HIGH: return 'bg-orange-50';
      case NotificationSeverity.MEDIUM: return 'bg-yellow-50';
      case NotificationSeverity.LOW: return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  const getSeverityIconColor = (severity: NotificationSeverity) => {
    switch (severity) {
      case NotificationSeverity.CRITICAL: return 'text-red-600';
      case NotificationSeverity.HIGH: return 'text-orange-600';
      case NotificationSeverity.MEDIUM: return 'text-yellow-700';
      case NotificationSeverity.LOW: return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SECURITY_ALERT: return <Shield className="w-5 h-5" />;
      case NotificationType.SENSOR_WARNING: return <AlertTriangle className="w-5 h-5" />;
      case NotificationType.DEVICE_OFFLINE: return <AlertTriangle className="w-5 h-5" />;
      case NotificationType.SYSTEM_INFO: return <Info className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 border-l-4 p-4 transition-colors hover:bg-opacity-80 ${
        getSeverityStripe(notification.severity)
      } ${notification.isRead ? 'bg-white' : getSeverityBg(notification.severity)}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-white border border-gray-200 ${
              getSeverityIconColor(notification.severity)
            }`}
          >
            {getSeverityIcon(notification.type)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-base leading-6 text-gray-900">
                {notification.title}
              </h3>

              {hasMetadata && (
                <button
                  type="button"
                  aria-expanded={openDetail}
                  aria-controls={detailId}
                  title={openDetail ? "Thu gọn" : "Xem chi tiết"}
                  onClick={() => setOpenDetail(!openDetail)}
                  className="shrink-0 rounded-md p-1 text-gray-500 hover:text-gray-900 hover:bg-white/60 transition"
                >
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${openDetail ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-700 leading-relaxed">
              {notification.message}
            </p>
            
            {hasMetadata && (
              <div
                id={detailId}
                className={`mt-3 overflow-hidden transition-all duration-300 ${
                  openDetail ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-white border border-gray-200 p-3 rounded-md text-xs space-y-1">
                  <p className="font-semibold text-gray-900 mb-1">Chi tiết</p>
                  {Object.entries(notification.metadata!).map(([key, value]) => (
                    <p key={key} className="wrap-break-word">
                      <span className="font-medium text-gray-700">{formatKey(key)}:</span>{' '}
                      <span className="text-gray-700">{formatValue(value)}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">🕐 {formatDate(notification.createdAt)}</span>
              {notification.location && (
                <span className="inline-flex items-center gap-1">📍 {notification.location}</span>
              )}
              {notification.emailSent && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email đã gửi
                </span>
              )}
              {notification.isRead && (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCheck className="w-3 h-3" /> Đã đọc
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {!notification.isRead && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <CheckCheck className="w-4 h-4 mr-1" /> Đánh dấu đã đọc
            </Button>
          )}
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" /> Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};
