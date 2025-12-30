import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'SOFT_DELETE'
  | 'RESTORE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'FAILED_LOGIN'
  | 'PASSWORD_CHANGE'
  | 'PERMISSION_CHANGE'
  | 'EXPORT'
  | 'IMPORT'
  | 'VIEW'
  | 'DOWNLOAD'
  | 'UPLOAD'
  | 'CUSTOM'

export type AuditStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'PARTIAL'

export interface AuditLogItem {
  id: string
  createdAt: string
  action: AuditAction
  entityName: string
  entityId?: string | null
  userId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  httpMethod?: string | null
  endpoint?: string | null
  responseStatus?: number | null
  responseTime?: number | null
  status: AuditStatus
  description?: string | null
  user?: {
    id: string
    username: string
    fullName: string
  } | null
}

export interface AuditLogsResponse {
  data: AuditLogItem[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface GetAuditLogsQueryParams {
  page?: number
  limit?: number
}

export const useGetAuditLogsQuery = (params: GetAuditLogsQueryParams = {}) => {
  const page = params.page ?? 1
  const limit = params.limit ?? 20

  return useQuery({
    queryKey: ['audit-logs', page, limit],
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<AuditLogsResponse> => {
      const { data } = await api.get(API_ROUTES.AUDIT_LOGS, {
        params: { page, limit }
      })
      return data
    }
  })
}
