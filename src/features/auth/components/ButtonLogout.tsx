import ROUTES from '@/shared/lib/routes'
import React from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useLogoutMutation } from '../api/AuthService'
import useAuthStore from '../stores/authStore'

interface LogoutWrapperProps {
  children: React.ReactElement<{ onClick?: () => void; disabled?: boolean }>
}

const LogoutWrapper = ({ children }: LogoutWrapperProps) => {
  const { mutateAsync: logoutAsync, isPending } = useLogoutMutation()
  const refreshToken = useAuthStore((state) => state.token?.refreshToken) || ''
  const navigate = useNavigate()

  const handleLogout = async () => {
    if (isPending) return

    try {
      await logoutAsync(refreshToken)
    } catch (err: any) {
      console.log('🚀 ~ handleLogout ~ err:', err.data)
      toast.error(err.data.message)
    } finally {
      navigate(ROUTES.LOGIN.url)
    }
  }

  return React.cloneElement(children, {
    onClick: handleLogout,
    disabled: isPending
  })
}

export default LogoutWrapper
