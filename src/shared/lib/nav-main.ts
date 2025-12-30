import { Users, CircleGauge, House, Settings, Bell, ScrollText } from "lucide-react";
import { PERMISSIONS } from "../constants/permissions";
import ROUTES from "./routes";

export interface NavItem {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  requiredPermission?: {
    method: string;
    path: string;
  };
  items?: SubNavItem[];
}

export interface SubNavItem {
  title: string;
  url: string;
  requiredPermission?: {
    method: string;
    path: string;
  };
}

const navMain: NavItem[] = [
  {
    title: "Người dùng",
    url: "#",
    icon: Users,
    isActive: true,
    items: [
      {
        title: ROUTES.USERS.title,
        url: ROUTES.USERS.url,
        requiredPermission: PERMISSIONS.USERS.LIST,
      },
      {
        title: ROUTES.USER_CREATE.title,
        url: ROUTES.USER_CREATE.url,
        requiredPermission: PERMISSIONS.USERS.CREATE,
      },
      {
        title: ROUTES.PERMISSIONS.title,
        url: ROUTES.PERMISSIONS.url,
        requiredPermission: PERMISSIONS.PERMISSIONS.LIST,
      },
      {
        title: ROUTES.ROLES.title,
        url: ROUTES.ROLES.url,
        requiredPermission: PERMISSIONS.ROLES.LIST,
      },
    ],
  },
  {
    title: ROUTES.OVERVIEW.title,
    url: ROUTES.OVERVIEW.url,
    icon: CircleGauge,
    isActive: true,
    requiredPermission: PERMISSIONS.OVERVIEW.OVERVIEW,
  },
  {
    title: "Các phòng",
    url: "#",
    icon: House,
    isActive: true,
    items: [
      {
        title: ROUTES.LIVING_ROOM.title,
        url: ROUTES.LIVING_ROOM.url,
        requiredPermission: PERMISSIONS.ROOMS.LIVING_ROOM.DETAILS,
      },
      {
        title: ROUTES.KITCHEN.title,
        url: ROUTES.KITCHEN.url,
        requiredPermission: PERMISSIONS.ROOMS.KITCHEN.DETAILS,
      },
      {
        title: ROUTES.BED_ROOM.title,
        url: ROUTES.BED_ROOM.url,
        requiredPermission: PERMISSIONS.ROOMS.BEDROOM.DETAILS,
      },
    ],
  },
  {
    title: "Cài đặt",
    url: "#",
    icon: Settings,
    isActive: true,
    items: [
      {
        title: ROUTES.GENERAL_SETTING.title,
        url: ROUTES.GENERAL_SETTING.url,
        requiredPermission: PERMISSIONS.SETTING,
      },
      {
        title: ROUTES.NOTIFICATION_SETTING.title,
        url: ROUTES.NOTIFICATION_SETTING.url,
        requiredPermission: PERMISSIONS.SETTING,
      },
      
    ],
  },
  {
    title: ROUTES.NOTIFICATION.title,
    url: ROUTES.NOTIFICATION.url,
    icon: Bell,
    isActive: true,
    requiredPermission: PERMISSIONS.NOTIFICATIONS.LIST,
  },
    {
    title: ROUTES.AUDIT_LOGS.title,
    url: ROUTES.AUDIT_LOGS.url,
    icon: ScrollText,
    isActive: true,
    requiredPermission: PERMISSIONS.AUDIT_LOGS.LIST,
  },
];

export default navMain;
