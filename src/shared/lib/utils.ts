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


export function normalizeObject<T>(obj: T): T {
  // 1. Dừng đệ quy nếu không phải object hoặc null
  if (typeof obj !== 'object' || obj === null) return obj

  // 2. Xử lý Mảng
  if (Array.isArray(obj)) {
    // Đệ quy từng phần tử và chỉ loại bỏ null/undefined
    const normalizedArray = obj
      .map((item) => normalizeObject(item))
      .filter((value) => value !== null && value !== undefined && value !== '') // Giữ lại 0, '', false, v.v.

    // Nếu mảng rỗng sau khi lọc, trả về undefined/null để bị loại bỏ
    return normalizedArray.length > 0 ? (normalizedArray as T) : (undefined as T)
  }

  // 3. Xử lý Đối tượng (Object)
  const normalizedObject = Object.fromEntries(
    Object.entries(obj as Record<string, unknown>)
      .map(([key, value]) => {
        if (value instanceof Date) {
          return [key, value.toISOString()]
        }
        if (typeof value === 'string') {
          return [key, value.trim()]
        }
        return [key, normalizeObject(value)]
      })
      .filter(([, value]) => value !== null && value !== undefined && value !== '') // Chỉ loại bỏ null/undefined
  )

  // Nếu đối tượng rỗng sau khi lọc, trả về undefined/null để bị loại bỏ
  return Object.keys(normalizedObject).length > 0 ? (normalizedObject as T) : (undefined as T)
}
