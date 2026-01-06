import type { PermissionRequirement } from "@/shared/lib/utils";


// Permission constants cho các actions trong hệ thống
export const PERMISSIONS = {
  // Users
  USERS: {
    LIST: { method: "GET", path: "/users" } as PermissionRequirement,
    CREATE: { method: "POST", path: "/users" } as PermissionRequirement,
    UPDATE: { method: "PATCH", path: "/users/:id" } as PermissionRequirement,
    DELETE: { method: "DELETE", path: "/users/:id" } as PermissionRequirement,
    VIEW: { method: "GET", path: "/users/:id" } as PermissionRequirement,
  },

  // Roles
  ROLES: {
    LIST: { method: "GET", path: "/roles" } as PermissionRequirement,
    CREATE: { method: "POST", path: "/roles" } as PermissionRequirement,
    UPDATE: { method: "PATCH", path: "/roles/:id" } as PermissionRequirement,
    DELETE: { method: "DELETE", path: "/roles/:id" } as PermissionRequirement,
    VIEW: { method: "GET", path: "/roles/:id" } as PermissionRequirement,
  },

  // Permissions
  PERMISSIONS: {
    LIST: { method: "GET", path: "/permissions" } as PermissionRequirement,
    MODULES: {
      method: "GET",
      path: "/permissions/module/:module",
    } as PermissionRequirement,
    UPDATE: {
      method: "PATCH",
      path: "/permissions/:id",
    } as PermissionRequirement,
  },

  // Overview
  OVERVIEW: {
    OVERVIEW: {
      method: "GET",
      path: "/overview",
    } as PermissionRequirement,
    LIGHTS: {
      method: "PATCH",
      path: "/overview/lights",
    } as PermissionRequirement,
    DOORS: {
      method: "PATCH",
      path: "/overview/doors",
    } as PermissionRequirement,
    WINDOWS: {
      method: "PATCH",
      path: "/overview/windows",
    } as PermissionRequirement,
  },

  // Audit Logs
  AUDIT_LOGS: {
    LIST: { method: 'GET', path: '/audit-log' } as PermissionRequirement,
    VIEW: { method: 'GET', path: '/audit-log/:id' } as PermissionRequirement,
  },

  // Setting
  SETTING: {
    method: "GET",
    path: "/settings",
  } as PermissionRequirement,

  // Notification
  NOTIFICATIONS: {
    LIST: {
      method: "GET", 
      path: "/notifications",
    } as PermissionRequirement,
    UNREAD_COUNT: {
      method: "GET",
      path: "/notifications/unread-count",
    } as PermissionRequirement,
    VIEW: {
      method: "GET",
      path: "/notifications/:id",
    } as PermissionRequirement,
    MARK_AS_READ: {
      method: "PATCH",
      path: "/notifications/:id/read",
    } as PermissionRequirement,
    MARK_ALL_AS_READ: {
      method: "PATCH",
      path: "/notifications/mark-all-read",
    } as PermissionRequirement,
    DELETE: {
      method: "DELETE",
      path: "/notifications/:id",
    } as PermissionRequirement,
  },

  // Room
  ROOMS: {
    LIVING_ROOM: {
      EACH_LIGHT: {
        method: "PATCH",
        path: "/living-room/light/:deviceId",
      } as PermissionRequirement,
      EACH_DOOR: {
        method: "PATCH",
        path: "/living-room/door/:deviceId",
      } as PermissionRequirement,
      DETAILS: {
        method: "GET",
        path: "/living-room/details",
      } as PermissionRequirement,
      ALL_LIGHTS: {
        method: "PATCH",
        path: "/living-room/lights/control-all",
      } as PermissionRequirement,
      ALL_DOORS: {
        method: "PATCH",
        path: "/living-room/doors/control-all",
      } as PermissionRequirement,
      DOOR_PASSWORD: {
        method: "PATCH",
        path: "/living-room/door/:deviceId/change-password",
      } as PermissionRequirement,
    },
    BEDROOM: {
      EACH_LIGHT: {
        method: "PATCH",
        path: "/bedroom/light/:deviceId",
      } as PermissionRequirement,
      EACH_DOOR: {
        method: "PATCH",
        path: "/bedroom/door/:deviceId",
      } as PermissionRequirement,
      DETAILS: {
        method: "GET",
        path: "/bedroom/details",
      } as PermissionRequirement,
      ALL_LIGHTS: {
        method: "PATCH",
        path: "/bedroom/lights/control-all",
      } as PermissionRequirement,
      ALL_DOORS: {
        method: "PATCH",
        path: "/bedroom/doors/control-all",
      } as PermissionRequirement,
      DOOR_PASSWORD: {
        method: "PATCH",
        path: "/bedroom/door/:deviceId/change-password",
      } as PermissionRequirement,
    },
    KITCHEN: {
      EACH_LIGHT: {
        method: "PATCH",
        path: "/kitchen/light/:deviceId",
      } as PermissionRequirement,
      EACH_WINDOW: {
        method: "PATCH",
        path: "/kitchen/window/:deviceId",
      } as PermissionRequirement,
      ALL_LIGHTS: {
        method: "PATCH",
        path: "/kitchen/lights/control-all",
      } as PermissionRequirement,
      ALL_WINDOWS: {
        method: "PATCH",
        path: "/kitchen/windows",
      } as PermissionRequirement,
      AUTO_MODE: {
        method: "PATCH",
        path: "/kitchen/auto",
      } as PermissionRequirement,
      DETAILS: {
        method: "GET",
        path: "/kitchen/details",
      } as PermissionRequirement,
    },
  },
};
