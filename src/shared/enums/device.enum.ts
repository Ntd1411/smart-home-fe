export const DeviceType = {
  LIGHT: 'light',
  DOOR: 'door',
  WINDOW: 'window',
  TEMP_HUMID_SENSOR: 'temp_humid_sensor',
  GAS_SENSOR: 'gas_sensor',
  LIGHT_SENSOR: 'light_sensor',
} as const;

export type DeviceType = typeof DeviceType[keyof typeof DeviceType];

export const DeviceStatus = {
  ONLINE: 'online',
  OFFLINE: 'offline',
} as const;

export type DeviceStatus = typeof DeviceStatus[keyof typeof DeviceStatus];
