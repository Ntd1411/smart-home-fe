import { useGetRoleInfinite } from '@/features/roles/api/RoleService'
import ForwardedInfiniteCombobox, { type UseInfiniteQueryResult } from '@/shared/components/ForwardedInfiniteCombobox'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { cn } from '@/shared/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'

interface RoleComboboxItem {
  id: string
  name: string
}

interface ComboboxRoleProps {
  value?: string
  onValueChange?: (value: string) => void
  values?: string[]
  onValuesChange?: (values: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  width?: string
  error?: string
  isActive?: boolean
  isSystemRole?: boolean
  multiple?: boolean
  maxSelection?: number
  showSelectionCount?: boolean
  searchPlaceholder?: string
  emptyText?: string
}

const ComboboxRole = ({
  value,
  onValueChange,
  values = [],
  onValuesChange,
  placeholder = 'Chọn vai trò...',
  disabled = false,
  className,
  width = '100%',
  multiple = false,
  maxSelection,
  showSelectionCount = false,
  isActive,
  isSystemRole,
  error,
  searchPlaceholder = 'Tìm kiếm vai trò...',
  emptyText = 'Không tìm thấy vai trò'
}: ComboboxRoleProps) => {
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const queryResult = useGetRoleInfinite({
    search: debouncedSearchValue,
    isActive: isActive ? true : undefined,
    isSystemRole: isSystemRole ? true : undefined,
  })


  const roles: UseInfiniteQueryResult<RoleComboboxItem> = {
    ...queryResult,
    data: queryResult.data?.pages
      ? {
          ...queryResult.data,
          pages: queryResult.data.pages.map((page) => ({
            ...page,
            data: page?.data?.map((role) => ({
              id: role.id,
              name: role.name,
            }))
          }))
        }
      : undefined
  }


  return (
    <ForwardedInfiniteCombobox
      queryResult={roles}
      value={value}
      onValueChange={onValueChange}
      values={values}
      onValuesChange={onValuesChange}
      multiple={multiple}
      maxSelection={maxSelection}
      showSelectionCount={showSelectionCount}
      width={width}
      className={className}
      error={error}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      onSearchValueChange={setSearchValue}
      disabled={disabled}
      itemRenderer={(role, isSelected, isMaxReached) => (
        <>
          <Check className={cn('mr-2 h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
          <div className='flex-1 min-w-0'>
            <div className='truncate font-medium'>{role?.name}</div>
          </div>
          {isMaxReached && <span className='text-xs text-muted-foreground ml-2 shrink-0'>Đã đạt giới hạn</span>}
        </>
      )}
    />
  )
}

export { ComboboxRole }
export default ComboboxRole
