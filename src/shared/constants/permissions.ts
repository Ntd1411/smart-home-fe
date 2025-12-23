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

  },

  // Setting
  SETTING: {
    method: "GET",
    path: "/settings",
  } as PermissionRequirement,

  // Room
  ROOMS: {
    LIVING_ROOM: {
      LIGHT: {
        method: "PATCH",
        path: "/living-room/light",
      } as PermissionRequirement,
      DOOR: {
        method: "PATCH",
        path: "/living-room/door",
      } as PermissionRequirement,
      DETAILS: {
        method: "GET",
        path: "/living-room/details",
      } as PermissionRequirement,
    },
    BEDROOM: {
      LIGHT: {
        method: "PATCH",
        path: "/bedroom/light",
      } as PermissionRequirement,
      DOOR: {
        method: "PATCH",
        path: "/bedroom/door",
      } as PermissionRequirement,
      DETAILS: {
        method: "GET",
        path: "/bedroom/details",
      } as PermissionRequirement,
    },
  },
};
