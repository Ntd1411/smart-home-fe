import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'
import { LoginSchema, type LoginBodyType } from '@/shared/validations/AuthSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import { useLoginMutation } from '../api/AuthService'

interface LoginFormProps {
  onSuccess?: () => void
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  // lưu thông tin báo lỗi 
  const [error, setError] = useState<string | null>(null)
  // chuyển trang 
  const navigate = useNavigate()
  // lấy thông tin về URL hiện tại
  const location = useLocation()
  // useLocation()
  const { mutateAsync: loginMutation, isPending } = useLoginMutation()

  // cơ chế redirect sau khi đăng nhập thành công.
  const from = location.state?.from || '/overview'

  // tạo một react hook form.
  // kết nối với schema Zod (LoginSchema) để tự động validate
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginBodyType) => {
    try {
      await loginMutation(data)
      onSuccess?.()
      navigate(from, { replace: true }) // chuyển hướng đến trang mong muốn
    } catch (error: any) {
      setError(error.message || 'Vui lòng kiểm tra lại thông tin.')
    }
  }

  return (
    <Card className='bg-white/60 backdrop-blur-xs'>
      <CardHeader className='space-y-1'>
        <div className='flex flex-col items-center space-y-4'>
          <div className='flex items-center gap-3'>
            <img src='/smarthome.jpg' alt='logo' className='h-16 w-16 object-contain' />
          </div>
        </div>
        <CardTitle className='text-2xl text-center hidden'>Đăng nhập</CardTitle>
        <CardDescription className='text-center hidden'>Nhập thông tin để truy cập hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên đăng nhập' type='text' {...field} autoFocus />
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
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input placeholder='••••••••' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className={cn('w-full cursor-pointer', !form.formState.isDirty && 'pointer-events-none')}
              disabled={isPending || !form.formState.isDirty}
            >
              {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Đăng nhập
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginForm
