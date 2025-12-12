import { type ReactNode } from 'react'

import ComboboxRole from '@/features/roles/components/ComboboxRole.tsx'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { PasswordInput, PasswordInputAdornmentToggle, PasswordInputInput } from '@/shared/components/ui/password-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Separator } from '@/shared/components/ui/separator'
import { Gender } from '@/shared/lib/enum'
import { cn } from '@/shared/lib/utils'
import { type CreateUser, CreateUserSchema, type UpdateUser, type User } from '@/shared/validations/UserSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface UserFormProps {
  user?: User
  onSubmit?: (data: CreateUser | UpdateUser) => void
  isLoading?: boolean
  mode: 'create' | 'edit' | 'view'
}

export const UserForm = ({ user, onSubmit, isLoading, mode }: UserFormProps) => {
  const isViewMode = mode === 'view'
  const isCreateMode = mode === 'create'

  const formatDateInput = (value: unknown) => {
    if (!value) return ''
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    if (typeof value === 'string') return value.slice(0, 10)
    return ''
  }

  const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className='space-y-3'>
      <h3 className='text-lg font-semibold text-primary'>{title}</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{children}</div>
    </section>
  )

  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema) as any,
    defaultValues: {
      fullName: user?.fullName || undefined,
      username: mode === 'edit' ? user?.username || undefined : undefined,
      password: mode === 'edit' ? undefined : '1',
      gender: user?.gender,
      phone: user?.phone || undefined,
      email: user?.email || undefined,
      currentAddress: user?.currentAddress || undefined,
      dateOfBirth: user?.dateOfBirth || undefined,
      roleIds: user?.roles?.map((role) => role.id) || []
    }
  })

  const handleSubmit = (data: CreateUser) => {
    if (onSubmit) onSubmit(data)
    return
  }

  return (
    <Card className='py-0'>
      <CardHeader className='sr-only'>
        <CardTitle className='flex items-center gap-2 text-2xl'>
          {mode === 'create' ? 'Thêm người dùng mới' : mode === 'edit' ? 'Chỉnh sửa người dùng' : 'Chi tiết người dùng'}
        </CardTitle>
        <CardDescription className='text-base'>
          {mode === 'create'
            ? 'Điền đầy đủ thông tin để tạo tài khoản người dùng mới trong hệ thống'
            : mode === 'edit'
            ? 'Cập nhật thông tin chi tiết của người dùng'
            : 'Xem thông tin chi tiết người dùng'}
        </CardDescription>
      </CardHeader>

      <CardContent className='p-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
            <Section title='Thông tin cơ bản'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Họ và tên *</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập họ và tên đầy đủ' {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Giới tính</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full' disabled={isViewMode}>
                          <SelectValue placeholder='Chọn giới tính' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Nam</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel className='text-sm font-medium'>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        value={formatDateInput(field.value)}
                        onChange={(e) => field.onChange(e.target.value ? (e.target.value as any) : undefined)}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            <Separator className='my-4' />

            <Section title='Thông tin liên hệ'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='example@email.com' {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder='0987654321' {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='currentAddress'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel className='text-sm font-medium'>Địa chỉ hiện tại</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập địa chỉ hiện tại' {...field} disabled={isViewMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            <Separator className='my-4' />

            <Section title='Thông tin công việc'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Username *</FormLabel>
                    <FormControl>
                      <Input placeholder='Nhập username' {...field} disabled={!isCreateMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium'>Mật khẩu</FormLabel>
                    <PasswordInput>
                      <FormControl>
                        <PasswordInputInput
                          autoComplete='new-password'
                          placeholder='Nhập mật khẩu'
                          {...field}
                          disabled={isViewMode}
                        />
                      </FormControl>
                      <PasswordInputAdornmentToggle />
                    </PasswordInput>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='roleIds'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel className='text-sm font-medium'>Vai trò *</FormLabel>
                    <FormControl>
                      <ComboboxRole
                        values={form.watch('roleIds')}
                        onValuesChange={field.onChange}
                        multiple={true}
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            {mode !== 'view' && (
              <div
                className={cn(
                  'flex justify-end',
                  form.formState.isDirty && 'sticky bottom-0 bg-background border rounded-lg border-input p-4'
                )}
              >
                <Button
                  type='submit'
                  disabled={isLoading || !form.formState.isDirty}
                  className={cn('cursor-pointer', !form.formState.isDirty && 'pointer-events-none')}
                >
                  {isLoading ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      {mode === 'create' ? 'Thêm người dùng' : 'Cập nhật thông tin'}
                    </div>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
