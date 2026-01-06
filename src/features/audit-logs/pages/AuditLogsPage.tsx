import { useGetAuditLogsQuery } from '@/features/audit-logs/api/AuditLogService'
import { FormPageLayout } from '@/shared/components/FormPageLayout'
import { withPermissionGuard } from '@/shared/components/WithPermissionGuard'
import { PERMISSIONS } from '@/shared/constants/permissions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/components/ui/dialog'
import { Eye, Loader2, RefreshCw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { AuditLogItem } from '@/features/audit-logs/api/AuditLogService'

const ACTION_LABELS_VI: Record<string, string> = {
  CREATE: 'Tạo mới',
  UPDATE: 'Cập nhật',
  DELETE: 'Xóa',
  SOFT_DELETE: 'Xóa (mềm)',
  RESTORE: 'Khôi phục',
  PERMISSION_CHANGE: 'Thay đổi quyền',
  CUSTOM: 'Tùy chỉnh'
}

const STATUS_LABELS_VI: Record<string, string> = {
  SUCCESS: 'Thành công',
  FAILED: 'Thất bại',
  PENDING: 'Đang xử lý',
  PARTIAL: 'Một phần'
}

const ENTITY_LABELS_VI: Record<string, string> = {
  User: 'Người dùng',
  UserEntity: 'Người dùng',
  Role: 'Vai trò',
  RoleEntity: 'Vai trò',
  PermissionEntity: 'Quyền',
  RefreshTokenEntity: 'Refresh token',
  AuditLogEntity: 'Nhật ký hoạt động',
  SettingEntity: 'Cài đặt',
  SecuritySettingEntity: 'Cài đặt',
  NotificationEntity: 'Thông báo',
  DeviceEntity: 'Thiết bị',
  Device: 'Thiết bị',
  RoomSensorSnapshotEntity: 'Dữ liệu cảm biến',
  SensorDataEntity: 'Dữ liệu cảm biến'
}

const toViLabel = (value: string | null | undefined, mapping: Record<string, string>) => {
  const raw = (value ?? '').toString().trim()
  if (!raw) return '--'
  return mapping[raw] ?? raw
}

const getDescriptionPreview = (description?: string | null): string => {
  if (!description?.trim()) return '--'
  const cleaned = description.replace(/\s+/g, ' ').trim()
  const maxLen = 90
  return cleaned.length > maxLen ? `${cleaned.slice(0, maxLen)}…` : cleaned
}

const splitDescriptionToBullets = (description: string): string[] => {
  const cleaned = description.trim()
  if (!cleaned) return []

  // Split major sections by ';'
  const sections = cleaned
    .split(/\s*;\s*/g)
    .map((s) => s.trim())
    .filter(Boolean)

  const splitKeyValueList = (value: string): string[] => {
    // Split on comma+space only when the next chunk looks like "<label>: ..."
    return value
      .split(/,\s(?=[^,]{1,40}:\s)/g)
      .map((s) => s.trim())
      .filter(Boolean)
  }

  const bullets: string[] = []

  for (const section of sections) {
    const normalized = section.replace(/\s+/g, ' ').trim()

    if (/^Chi tiết:\s*/i.test(normalized)) {
      const rest = normalized.replace(/^Chi tiết:\s*/i, '').trim()
      bullets.push(...splitKeyValueList(rest))
      continue
    }

    if (/^Dữ liệu:\s*/i.test(normalized)) {
      const rest = normalized.replace(/^Dữ liệu:\s*/i, '').trim()
      bullets.push(...splitKeyValueList(rest))
      continue
    }

    bullets.push(normalized)
  }

  return bullets
}

const AuditLogsPageComponent = () => {
  const [page, setPage] = useState(1)
  const limit = 20
  const {
    data,
    isLoading,
    isFetching,
    refetch: refetchAuditLogs
  } = useGetAuditLogsQuery({ page, limit })
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<AuditLogItem | null>(null)

  const pagination = useMemo(() => {
    const total = data?.meta.total ?? 0
    const totalPages = Math.max(1, data?.meta.totalPages ?? 1)
    const safePage = Math.min(Math.max(1, page), totalPages)

    const start = total === 0 ? 0 : (safePage - 1) * limit + 1
    const end =
      total === 0
        ? 0
        : Math.min((safePage - 1) * limit + (data?.data.length ?? 0), total)

    return {
      total,
      totalPages,
      page: safePage,
      start,
      end
    }
  }, [data?.data.length, data?.meta.total, data?.meta.totalPages, limit, page])

  useEffect(() => {
    if (!data) return
    if (page !== pagination.page) setPage(pagination.page)
  }, [data, page, pagination.page])

  const descriptionBullets = useMemo(() => {
    if (!selected?.description) return []
    return splitDescriptionToBullets(selected.description)
  }, [selected?.description])

  if (isLoading && !data) {
    return (
      <FormPageLayout title='Lịch sử hoạt động' description='Các hành động đã được ghi nhận trong hệ thống'>
        <div className='flex items-center justify-center h-40'>
          <Loader2 className='animate-spin w-6 h-6' />
        </div>
      </FormPageLayout>
    )
  }

  if (!data) {
    return (
      <FormPageLayout title='Lịch sử hoạt động' description='Các hành động đã được ghi nhận trong hệ thống'>
        <div className='p-6'>
          <p className='text-center text-muted-foreground'>Không có dữ liệu</p>
        </div>
      </FormPageLayout>
    )
  }

  return (
    <FormPageLayout title='Lịch sử hoạt động' description='Các hành động đã được ghi nhận trong hệ thống'>
      <div className='py-4'>
        <div className='flex items-center justify-end mb-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => refetchAuditLogs()}
            disabled={isFetching}
          >
            <RefreshCw className={'w-4 h-4 mr-2' + (isFetching ? ' animate-spin' : '')} />
            Làm mới
          </Button>
        </div>

        {isFetching && !isLoading && (
          <div className='text-center text-sm text-gray-500 mb-4'>
            <Loader2 className='animate-spin w-4 h-4 inline mr-2' />
            Đang cập nhật...
          </div>
        )}

        <div className='rounded-md border border-border overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead className='w-44'>Thời gian</TableHead>
                <TableHead className='w-48'>Người thực hiện</TableHead>
                <TableHead className='w-36'>Hành động</TableHead>
                <TableHead className='w-40'>Đối tượng</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className='w-28'>Trạng thái</TableHead>
                <TableHead className='w-16 text-right'>Xem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{log.user?.fullName || log.user?.username || '--'}</TableCell>
                  <TableCell>{toViLabel(log.action, ACTION_LABELS_VI)}</TableCell>
                  <TableCell>{toViLabel(log.entityName, ENTITY_LABELS_VI)}</TableCell>
                  <TableCell className='text-left max-w-md truncate'>
                    {getDescriptionPreview(log.description)}
                  </TableCell>
                  <TableCell>{toViLabel(log.status, STATUS_LABELS_VI)}</TableCell>
                  <TableCell className='text-right'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon-sm'
                      onClick={() => {
                        setSelected(log)
                        setOpen(true)
                      }}
                      aria-label='Xem chi tiết mô tả'
                      disabled={!log.description}
                    >
                      <Eye className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {pagination.total > 0 && (
          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-6'>
            <div className='text-sm text-gray-500'>
              Hiển thị {pagination.start}-{pagination.end} / {pagination.total}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
              >
                Trước
              </Button>
              <div className='text-sm text-gray-500'>
                Trang {pagination.page} / {pagination.totalPages}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) setSelected(null)
        }}
      >
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Chi tiết mô tả</DialogTitle>
            <DialogDescription>
              {selected
                ? `${new Date(selected.createdAt).toLocaleString()} • ${toViLabel(selected.action, ACTION_LABELS_VI)} • ${toViLabel(selected.entityName, ENTITY_LABELS_VI)}`
                : ''}
            </DialogDescription>
          </DialogHeader>

          {selected?.description ? (
            descriptionBullets.length ? (
              <ul className='list-disc pl-5 space-y-1'>
                {descriptionBullets.map((item, idx) => (
                  <li key={`${selected.id}-${idx}`} className='text-sm'>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-muted-foreground'>{selected.description}</p>
            )
          ) : (
            <p className='text-sm text-muted-foreground'>Không có mô tả</p>
          )}
        </DialogContent>
      </Dialog>
    </FormPageLayout>
  )
}

export const AuditLogsPage = withPermissionGuard(
  AuditLogsPageComponent,
  PERMISSIONS.AUDIT_LOGS.LIST
)
