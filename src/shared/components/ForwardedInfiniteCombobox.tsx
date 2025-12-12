import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { cn } from '@/shared/lib/utils'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Generic type cho item data
interface ComboboxItem {
  id: string | number
  name: string
  [key: string]: any
}

// Hook data interface - để component có thể hoạt động với bất kỳ tanstack query nào
interface UseInfiniteQueryResult<T> {
  data?: {
    pages: Array<{
      data: T[]
      [key: string]: any
    }>
  }
  isLoading: boolean
  hasNextPage?: boolean
  fetchNextPage: () => Promise<any>
  isFetchingNextPage: boolean
  error: any
  refetch: () => void
}

interface InfiniteComboboxProps<T extends ComboboxItem> {
  // Data & Query
  queryResult: UseInfiniteQueryResult<T>

  // Single select props
  value?: string
  onValueChange?: (value: string) => void

  // Multi select props
  values?: string[]
  onValuesChange?: (values: string[]) => void

  // UI Configuration
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  loadingText?: string
  errorText?: string
  retryText?: string
  clearAllText?: string
  selectionCountText?: (count: number, max?: number) => string
  displayMultipleText?: (first: string, count: number) => string

  // Behavior
  disabled?: boolean
  multiple?: boolean
  maxSelection?: number
  showSelectionCount?: boolean

  // Styling
  className?: string
  width?: string

  // Advanced
  itemRenderer?: (item: T, isSelected: boolean, isMaxReached: boolean) => React.ReactNode
  // Custom badge renderer - Nếu muốn tooltip custom, wrap Badge trong Tooltip component
  selectedBadgeRenderer?: (item: T, showRemove?: boolean) => React.ReactNode
  onItemSelect?: (item: T) => void
  filterFn?: (item: T, search: string) => boolean
  onSearchValueChange?: (value: string) => void
  textDisplay?: (item: T) => string

  // Error handling
  error?: string

  // Accessibility
  'aria-label'?: string
  maxShowSelectedItems?: number
}

function InfiniteCombobox<T extends ComboboxItem>(
  {
    queryResult,
    value,
    onValueChange,
    values = [],
    onValuesChange,
    placeholder = 'Chọn mục...',
    searchPlaceholder = 'Tìm kiếm...',
    emptyText = 'Không có dữ liệu',
    loadingText = 'Đang tải dữ liệu...',
    errorText = 'Có lỗi xảy ra khi tải dữ liệu',
    retryText = 'Thử lại',
    clearAllText = 'Xóa tất cả',
    selectionCountText = (count: number, max?: number) => `Đã chọn: ${count}${max ? ` / ${max}` : ''}`,
    displayMultipleText = (first: string, count: number) => `${first} và ${count - 1} khác`,
    disabled = false,
    multiple = false,
    maxSelection,
    showSelectionCount = false,
    className,
    width = '100%',
    itemRenderer,
    selectedBadgeRenderer,
    onItemSelect,
    filterFn,
    onSearchValueChange,
    error,
    'aria-label': ariaLabel,
    textDisplay,
    maxShowSelectedItems = 5
  }: InfiniteComboboxProps<T>,
  ref: React.Ref<HTMLButtonElement>
) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null) // Ref cho IntersectionObserver
  const [isScrolling, setIsScrolling] = useState(false)
  const [isAutoLoadingSelectedItems, setIsAutoLoadingSelectedItems] = useState(false)
  const autoLoadAttemptCountRef = useRef(0) // Track số lần attempt để tránh infinite loop
  const MAX_AUTO_LOAD_ATTEMPTS = 50 // Max số pages để auto-load (tránh TH data không tồn tại)

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, error: queryError, refetch } = queryResult

  // Lưu trữ tất cả dữ liệu đã tải từ API
  const [allItems, setAllItems] = useState<T[]>([])

  // Tổng hợp dữ liệu từ tất cả các trang
  const searchResults = useMemo(() => {
    return data?.pages?.flatMap((page) => page.data) || []
  }, [data])

  // Cập nhật danh sách items khi có dữ liệu mới
  useEffect(() => {
    if (searchResults.length > 0) {
      setAllItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id.toString()))
        const newItems = searchResults.filter((item) => !existingIds.has(item.id.toString()))
        return [...prev, ...newItems]
      })
    }
  }, [searchResults])

  // Lấy các item đã được chọn
  const selectedItems = useMemo(() => {
    if (multiple) {
      return allItems.filter((item) => values.includes(item.id.toString()))
    }
    return allItems.filter((item) => item.id.toString() === value)
  }, [allItems, multiple, values, value])

  // Reset auto-load attempt counter khi value/values thay đổi
  useEffect(() => {
    autoLoadAttemptCountRef.current = 0
  }, [value, values])

  // AUTO-LOAD: Tự động fetch next pages cho đến khi tìm thấy tất cả selected items
  // Đây là giải pháp tối ưu cho infinite query với pre-selected values
  useEffect(() => {
    const autoLoadSelectedItems = async () => {
      // Chỉ chạy khi không đang loading và không có search value (quan trọng!)
      if (isLoading || isFetchingNextPage || searchValue || isAutoLoadingSelectedItems) return

      // Kiểm tra limit để tránh infinite loop
      if (autoLoadAttemptCountRef.current >= MAX_AUTO_LOAD_ATTEMPTS) {
        console.warn(
          `Auto-load stopped after ${MAX_AUTO_LOAD_ATTEMPTS} attempts. Some selected items may not exist in the data.`
        )
        return
      }

      // Lấy danh sách IDs cần tìm
      const selectedIds = multiple ? values : value ? [value] : []
      if (selectedIds.length === 0) return

      // Kiểm tra xem đã có tất cả selected items chưa
      const existingIds = new Set(allItems.map((item) => item.id.toString()))
      const missingIds = selectedIds.filter((id) => !existingIds.has(id))

      // Nếu còn thiếu items và còn pages để load
      if (missingIds.length > 0 && hasNextPage) {
        autoLoadAttemptCountRef.current += 1
        setIsAutoLoadingSelectedItems(true)
        try {
          await fetchNextPage()
          // Sau khi fetch xong, useEffect sẽ tự chạy lại để kiểm tra tiếp
        } catch (error) {
          console.error('Error auto-loading selected items:', error)
        } finally {
          // Delay một chút để tránh gọi quá nhanh và cho phép UI update
          setTimeout(() => setIsAutoLoadingSelectedItems(false), 100)
        }
      } else if (missingIds.length > 0 && !hasNextPage) {
        // Đã load hết pages nhưng vẫn thiếu items - items không tồn tại
        console.warn('Some selected items do not exist in the data:', missingIds)
      }
    }

    autoLoadSelectedItems()
  }, [
    multiple,
    value,
    values,
    allItems,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    searchValue,
    isAutoLoadingSelectedItems,
    MAX_AUTO_LOAD_ATTEMPTS
  ])

  // IntersectionObserver để tự động load khi scroll đến cuối
  // Cách này tốt hơn scroll event vì:
  // - Tự động detect khi element visible (kể cả khi scroll nhanh)
  // - Không cần tính toán scroll position
  // - Performance tốt hơn
  useEffect(() => {
    // Chỉ setup observer khi popover đang mở
    if (!open || !loadMoreTriggerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        // Khi trigger element visible và có thể load thêm
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage && !isLoading && !isAutoLoadingSelectedItems) {
          fetchNextPage()
        }
      },
      {
        root: listRef.current,
        rootMargin: '50px', // Trigger trước khi đến cuối 50px
        threshold: 0.1
      }
    )

    observer.observe(loadMoreTriggerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [open, hasNextPage, isFetchingNextPage, isLoading, isAutoLoadingSelectedItems, fetchNextPage])

  // Backup scroll handler cho trường hợp IntersectionObserver không hoạt động
  const handleScroll = useCallback(() => {
    if (
      !listRef.current ||
      !hasNextPage ||
      isFetchingNextPage ||
      isLoading ||
      isScrolling ||
      isAutoLoadingSelectedItems
    )
      return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    const scrollThreshold = 150 // Tăng threshold để trigger sớm hơn

    // Check xem đã scroll gần đến cuối chưa
    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
      setIsScrolling(true)
      fetchNextPage().finally(() => {
        setTimeout(() => setIsScrolling(false), 300)
      })
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, isScrolling, isAutoLoadingSelectedItems, fetchNextPage])

  // Xử lý thay đổi giá trị tìm kiếm
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value)
      onSearchValueChange?.(value) // Callback để parent component có thể biết search value thay đổi
    },
    [onSearchValueChange]
  )

  // Xử lý chọn item
  const handleSelect = useCallback(
    (itemId: string) => {
      const selectedItem = allItems.find((item) => item.id.toString() === itemId)

      if (multiple) {
        const currentValues = values || []
        const isSelected = currentValues.includes(itemId)

        if (isSelected) {
          // Bỏ chọn
          const newValues = currentValues.filter((id) => id !== itemId)
          onValuesChange?.(newValues)
        } else {
          // Chọn mới (kiểm tra giới hạn)
          if (!maxSelection || currentValues.length < maxSelection) {
            const newValues = [...currentValues, itemId]
            onValuesChange?.(newValues)
          }
        }
      } else {
        // Single select
        const newValue = value === itemId ? '' : itemId
        onValueChange?.(newValue)
        setOpen(false)
        // setSearchValue('')
      }

      // Callback khi select item
      if (selectedItem && onItemSelect) {
        onItemSelect(selectedItem)
      }
    },
    [multiple, values, onValuesChange, maxSelection, onValueChange, value, allItems, onItemSelect]
  )

  // Xử lý xóa tất cả lựa chọn
  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (multiple) {
        onValuesChange?.([])
      } else {
        onValueChange?.('')
      }
    },
    [multiple, onValuesChange, onValueChange]
  )

  // Kiểm tra item có được chọn không
  const isSelected = useCallback(
    (itemId: string) => {
      if (multiple) {
        return values.includes(itemId)
      }
      return value === itemId
    },
    [multiple, values, value]
  )

  // Text hiển thị trên button
  const displayText = useMemo(() => {
    // Hiển thị loading khi đang tự động load selected items
    const hasSelectedIds = multiple ? values.length > 0 : !!value
    const isLoadingSelected = isAutoLoadingSelectedItems && hasSelectedIds && selectedItems.length === 0

    if (isLoadingSelected) {
      return 'Đang tải...'
    }

    if (multiple) {
      // Nếu có values nhưng chưa load được đủ items (một số đã load được)
      if (values.length > 0 && selectedItems.length > 0 && selectedItems.length < values.length) {
        if (showSelectionCount) {
          return `Đang tải (${selectedItems.length}/${values.length})...`
        }
        return `${textDisplay ? textDisplay(selectedItems[0]) : selectedItems[0].name} (đang tải thêm...)`
      }

      if (selectedItems.length === 0) {
        return placeholder
      }
      if (selectedItems.length === 1) {
        return textDisplay ? textDisplay(selectedItems[0]) : selectedItems[0].name
      }
      if (showSelectionCount) {
        return selectionCountText(selectedItems.length, maxSelection)
      }
      return displayMultipleText(
        textDisplay ? textDisplay(selectedItems[0]) : selectedItems[0].name,
        selectedItems.length
      )
    }

    // Single select - nếu có value nhưng chưa load được item
    if (value && selectedItems.length === 0) {
      return 'Đang tải...'
    }

    const selectedItem = selectedItems[0]
    return selectedItem ? (textDisplay ? textDisplay(selectedItem) : selectedItem.name) : placeholder
  }, [
    multiple,
    selectedItems,
    showSelectionCount,
    placeholder,
    selectionCountText,
    displayMultipleText,
    maxSelection,
    textDisplay,
    isAutoLoadingSelectedItems,
    value,
    values
  ])

  // Kiểm tra có selection không
  const hasSelection = multiple ? values.length > 0 : !!value

  // Reset search khi đóng popover
  useEffect(() => {
    if (!open) {
      // setSearchValue('')
    }
  }, [open])

  // Xử lý phím tắt
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  // Focus vào input khi mở popover
  useEffect(() => {
    if (open) {
      const input = document.querySelector('[cmdk-input]') as HTMLInputElement
      if (input) {
        setTimeout(() => {
          input.focus()
        }, 100)
      }
    }
  }, [open])

  // Xử lý retry khi có lỗi
  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  // Filter results nếu có custom filter function
  const filteredResults = useMemo(() => {
    if (!filterFn || !searchValue) {
      return searchResults
    }
    return searchResults.filter((item) => filterFn(item, searchValue))
  }, [searchResults, filterFn, searchValue])

  // Default item renderer với visual feedback tốt hơn
  const defaultItemRenderer = useCallback(
    (item: T, selected: boolean, isMaxReached: boolean) => (
      <>
        <Check className={cn('mr-2 h-4 w-4 shrink-0', selected ? 'opacity-100' : 'opacity-0')} />
        <span className='flex-1 truncate' title={item.name}>
          {item.name}
        </span>
        {isMaxReached && (
          <Badge variant='outline' className='text-xs h-5 ml-2 shrink-0 border-amber-500/50 text-amber-700'>
            Đã đạt giới hạn
          </Badge>
        )}
      </>
    ),
    []
  )

  // Xử lý remove item trong multiple mode
  const handleRemoveItem = useCallback(
    (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation()
      e.preventDefault()

      if (multiple) {
        const newValues = values.filter((id) => id !== itemId)
        onValuesChange?.(newValues)
      }
    },
    [multiple, values, onValuesChange]
  )

  // Default badge renderer với nút X để remove
  const defaultBadgeRenderer = useCallback(
    (item: T, showRemove: boolean = true) => (
      <Badge
        key={item.id}
        variant='secondary'
        className={cn(
          'gap-1 pl-2 pr-0.5 h-6 text-xs max-w-[150px] flex items-center',
          'transition-all duration-200',
          'hover:bg-primary/10',
          showRemove && 'group'
        )}
        title={item.name}
      >
        <span className='truncate flex-1'>{item.name}</span>
        {showRemove && (
          <button
            type='button'
            onClick={(e) => handleRemoveItem(e, item.id.toString())}
            className={cn(
              'rounded-sm opacity-70 ring-offset-background transition-colors cursor-pointer',
              'hover:bg-destructive/20 hover:text-destructive',
              'h-5 w-5 flex items-center justify-center'
            )}
            aria-label={`Xóa ${item.name}`}
          >
            <X className='h-3 w-3' />
          </button>
        )}
      </Badge>
    ),
    [handleRemoveItem]
  )

  // Render nội dung danh sách
  const renderContent = () => {
    // Loading state
    if (isLoading && filteredResults.length === 0) {
      return (
        <div className='py-8 text-center'>
          <Loader2 className='mx-auto h-5 w-5 animate-spin text-muted-foreground' />
          <p className='mt-2 text-sm text-muted-foreground'>{loadingText}</p>
        </div>
      )
    }

    // Error state
    if (queryError) {
      return (
        <div className='py-8 text-center'>
          <p className='text-sm text-destructive'>{errorText}</p>
          <Button variant='ghost' size='sm' className='mt-2 h-8 text-xs' onClick={handleRetry}>
            {retryText}
          </Button>
        </div>
      )
    }

    // Empty state
    if (filteredResults.length === 0) {
      return (
        <div className='py-8 text-center text-sm text-muted-foreground'>
          {searchValue ? `Không tìm thấy "${searchValue}"` : emptyText}
        </div>
      )
    }

    // Render danh sách
    return (
      <CommandGroup>
        {filteredResults.map((item: T) => {
          const selected = isSelected(item.id.toString())
          const isMaxReached = multiple && maxSelection && values.length >= maxSelection && !selected
          const renderer = itemRenderer || defaultItemRenderer

          return (
            <CommandItem
              key={item.id}
              value={item.id.toString()}
              onSelect={() => {
                if (!isMaxReached) {
                  handleSelect(item.id.toString())
                }
              }}
              className={cn('cursor-pointer', isMaxReached && 'opacity-50 cursor-not-allowed', selected && 'bg-accent')}
              disabled={!!isMaxReached}
            >
              {renderer(item, selected, !!isMaxReached)}
            </CommandItem>
          )
        })}
      </CommandGroup>
    )
  }

  return (
    <div className={cn('relative w-full', className)}>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          if (!disabled) setOpen(isOpen)
        }}
        modal={false}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            aria-haspopup='listbox'
            aria-label={ariaLabel || (multiple ? 'Chọn nhiều mục' : 'Chọn mục')}
            className={cn(
              'w-full justify-between hover:bg-background cursor-pointer',
              !hasSelection && 'text-muted-foreground',
              error && 'border-destructive',
              disabled && 'cursor-not-allowed opacity-50',
              multiple && selectedItems.length > 0 && 'justify-start'
            )}
            disabled={disabled}
            onKeyDown={handleKeyDown}
            style={{ width: width !== '100%' ? width : undefined }}
          >
            {multiple && selectedItems.length > 0 ? (
              <TooltipProvider>
                <div className='flex flex-wrap items-center gap-1 flex-1 mr-8'>
                  {isAutoLoadingSelectedItems && (
                    <Loader2 className='h-3 w-3 animate-spin shrink-0 text-muted-foreground' />
                  )}
                  {selectedItems
                    .slice(0, maxShowSelectedItems)
                    .map((item) =>
                      selectedBadgeRenderer ? selectedBadgeRenderer(item) : defaultBadgeRenderer(item, true)
                    )}
                  {selectedItems.length > maxShowSelectedItems && (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Badge
                          variant='secondary'
                          className='text-xs h-6 px-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-default'
                        >
                          +{selectedItems.length - maxShowSelectedItems} khác
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side='top' className='max-w-xs'>
                        <ul className='text-xs space-y-1 list-disc list-inside'>
                          {selectedItems.slice(maxShowSelectedItems, maxShowSelectedItems + 10).map((item) => (
                            <li key={item.id}>{item.name}</li>
                          ))}
                          {selectedItems.length > maxShowSelectedItems + 10 && (
                            <p className='text-muted-foreground'>
                              và {selectedItems.length - maxShowSelectedItems - 10} khác...
                            </p>
                          )}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {/* Hiển thị số lượng đang load nếu có */}
                  {values.length > selectedItems.length && (
                    <Badge
                      variant='outline'
                      className='text-xs h-7 px-2 text-muted-foreground border-dashed animate-pulse'
                    >
                      +{values.length - selectedItems.length} đang tải...
                    </Badge>
                  )}
                </div>
              </TooltipProvider>
            ) : (
              <span className='pr-11 overflow-hidden truncate flex items-center gap-2'>
                {isAutoLoadingSelectedItems && (
                  <Loader2 className='h-3 w-3 animate-spin shrink-0 text-muted-foreground' />
                )}
                {displayText}
              </span>
            )}
            <ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50 absolute right-2' />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className='p-0 w-(--radix-popover-trigger-width) overscroll-y-contain'
          align='start'
          sideOffset={4}
        >
          <Command shouldFilter={false} className='w-full'>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={handleSearchChange}
              className='h-9'
            />

            {multiple && (
              <div className='px-3 py-1 text-xs bg-muted/30 border-b flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2 flex-1 min-w-0'>
                  <span className='font-medium text-foreground'>
                    {selectionCountText(selectedItems.length, maxSelection)}
                  </span>
                  {values.length > selectedItems.length && (
                    <span className='text-muted-foreground flex items-center gap-1'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      <span className='truncate'>Đang tải thêm...</span>
                    </span>
                  )}
                </div>
                {values.length > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className={cn(
                      'h-7 px-2.5 text-xs font-medium transition-all',
                      'hover:bg-destructive hover:text-accent',
                      'focus:ring-2 focus:ring-destructive focus:ring-offset-1'
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onValuesChange?.([])
                    }}
                  >
                    <X className='h-3 w-3 mr-1' />
                    {clearAllText}
                  </Button>
                )}
              </div>
            )}

            <CommandList
              className='max-h-[200px] overflow-y-auto overscroll-y-contain'
              ref={listRef}
              onScroll={handleScroll}
            >
              {renderContent()}

              {/* Trigger element cho IntersectionObserver - tự động load khi scroll đến đây */}
              {hasNextPage && !isAutoLoadingSelectedItems && filteredResults.length > 0 && (
                <div ref={loadMoreTriggerRef} className='h-1' aria-hidden='true' />
              )}

              {isFetchingNextPage && (
                <div className='py-3 text-center border-t'>
                  <Loader2 className='mx-auto h-4 w-4 animate-spin text-muted-foreground' />
                  <p className='mt-1 text-xs text-muted-foreground'>Đang tải thêm...</p>
                </div>
              )}

              {!hasNextPage && filteredResults.length > 0 && (
                <div className='py-2 text-center text-xs text-muted-foreground border-t'>
                  {filteredResults.length === 1
                    ? 'Đã hiển thị 1 mục'
                    : `Đã hiển thị tất cả ${filteredResults.length} mục`}
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Clear button - Nút xóa tất cả */}
      {hasSelection && !disabled && (
        <button
          type='button'
          className={cn(
            'absolute top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center',
            'rounded-md opacity-60 ring-offset-background transition-all duration-200',
            'hover:opacity-100 hover:bg-destructive/10 hover:text-destructive cursor-pointer z-10',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
            'active:scale-95',
            multiple && selectedItems.length > 0 ? 'right-7' : 'right-8'
          )}
          onClick={handleClearAll}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={multiple ? `Xóa tất cả (${selectedItems.length} mục)` : 'Xóa lựa chọn'}
          title={multiple ? `Xóa tất cả ${selectedItems.length} mục` : 'Xóa lựa chọn'}
          tabIndex={-1}
        >
          <X className='h-3.5 w-3.5' />
        </button>
      )}

      {/* Error message */}
      {error && (
        <p className='mt-1 text-xs text-destructive' role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}

const ForwardedInfiniteCombobox = forwardRef(InfiniteCombobox) as <T extends ComboboxItem>(
  props: InfiniteComboboxProps<T> & { ref?: React.Ref<HTMLButtonElement> }
) => React.ReactElement

export default ForwardedInfiniteCombobox
export type { ComboboxItem, InfiniteComboboxProps, UseInfiniteQueryResult }
