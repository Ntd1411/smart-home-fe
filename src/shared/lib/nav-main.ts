import {
  Users,
} from 'lucide-react'
import { PERMISSIONS } from '../constants/permissions'
import ROUTES from './routes'

export interface NavItem {
  title: string
  url: string
  icon?: any
  isActive?: boolean
  requiredPermission?: {
    method: string
    path: string
  }
  items?: SubNavItem[]
}

export interface SubNavItem {
  title: string
  url: string
  requiredPermission?: {
    method: string
    path: string
  }
}

const navMain: NavItem[] = [
  {
    title: 'Người dùng',
    url: '#',
    icon: Users,
    isActive: true,
    items: [
      {
        title: ROUTES.USERS.title,
        url: ROUTES.USERS.url,
        requiredPermission: PERMISSIONS.USERS.LIST
      },
      {
        title: ROUTES.USER_CREATE.title,
        url: ROUTES.USER_CREATE.url,
        requiredPermission: PERMISSIONS.USERS.CREATE
      },
      {
        title: ROUTES.PERMISSIONS.title,
        url: ROUTES.PERMISSIONS.url,
        requiredPermission: PERMISSIONS.PERMISSIONS.MODULES
      },
      {
        title: ROUTES.ROLES.title,
        url: ROUTES.ROLES.url,
        requiredPermission: PERMISSIONS.ROLES.LIST
      },
    ]
  },
]

export default navMain
