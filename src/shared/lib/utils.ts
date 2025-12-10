import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PermissionType } from '../validations/PermissionSchema';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Permission checking utility
export interface PermissionRequirement {
  method: string
  path: string
}


// 
export function hasPermission(userPermissions: PermissionType[], requiredPermission: PermissionRequirement): boolean {
  if (!userPermissions || userPermissions.length === 0) {
    return false
  }

  return userPermissions.some(
    (permission) => permission.method === requiredPermission.method && permission.path === requiredPermission.path
  )
}