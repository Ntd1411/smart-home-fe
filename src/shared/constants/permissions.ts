import type { PermissionRequirement } from '@/shared/lib/utils'

// Permission constants cho các actions trong hệ thống
export const PERMISSIONS = {

  // Users
  USERS: {
    LIST: { method: 'GET', path: '/users' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/users' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/users/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/users/:id/hard' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/users/:id' } as PermissionRequirement
  },

  // Roles
  ROLES: {
    LIST: { method: 'GET', path: '/roles' } as PermissionRequirement,
    CREATE: { method: 'POST', path: '/roles' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/roles/:id' } as PermissionRequirement,
    DELETE: { method: 'DELETE', path: '/roles/:id' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/roles/:id' } as PermissionRequirement
  },

  // Permissions
  PERMISSIONS: {
    MODULES: { method: 'GET', path: '/permissions/module/:module' } as PermissionRequirement,
    UPDATE: { method: 'PUT', path: '/permissions/:id' } as PermissionRequirement
  },
}
