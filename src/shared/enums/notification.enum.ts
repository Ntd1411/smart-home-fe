export const NotificationType = {
  SECURITY_ALERT: 'security_alert',
  SENSOR_WARNING: 'sensor_warning',
  DEVICE_OFFLINE: 'device_offline',
  SYSTEM_INFO: 'system_info',
} as const;

export type NotificationType =
  typeof NotificationType[keyof typeof NotificationType];

export const NotificationSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type NotificationSeverity =
  typeof NotificationSeverity[keyof typeof NotificationSeverity];
