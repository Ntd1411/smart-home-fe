const API_ROUTES = {
  AUTH: {
    LOGIN: '/v1/auth/login',
    REFRESH_TOKEN: '/v1/auth/refresh-token',
    LOGOUT: '/v1/auth/logout',
    ME: 'v1/auth/me'
  },
  ACADEMIC_YEARS: '/v1/academic-years',
  FACULTIES: {
    ROOT: '/v1/faculties',
    MERGE: '/v1/faculties/merge'
  },
  USERS: '/v1/users',
  ACCOUNTS: '/v1/accounts',
  PERMISSIONS: '/v1/permissions',
  ROLES: '/v1/roles',
  AUDIT_LOGS: '/v1/audit-logs',
}

export default API_ROUTES
