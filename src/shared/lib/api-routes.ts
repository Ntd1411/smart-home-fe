const API_ROUTES = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REFRESH_TOKEN: '/v1/auth/refresh-token',
    LOGOUT: '/v1/auth/logout',
    ME: '/v1/auth/me',
    UPDATE_PROFILE: '/v1/auth/profile',
    CHANGE_PASSWORD: '/v1/auth/change-password'
  },
  USERS: '/v1/users',
  PERMISSIONS: '/v1/permissions',
  ROLES: '/v1/roles',
  AUDIT_LOGS: '/v1/audit-log',
  NOTIFICATIONS: '/v1/notifications',
}

export default API_ROUTES
