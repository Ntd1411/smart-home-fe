import ROUTES from '@/shared/lib/routes'
import { Navigate, Outlet, useLoaderData, useLocation } from 'react-router'
import { authLoader } from '../api/AuthLoader'
import { useSocketStore } from '@/shared/stores/useSocketStore'
import useAuthStore from '../stores/authStore'
import { useEffect } from 'react'

// Route Protector
const AuthGuard = () => {
  const { auth } = useLoaderData<typeof authLoader>()
  const location = useLocation()
  const connect = useSocketStore((s) => s.connect)
  const accessToken = useAuthStore((s) => s.token?.accessToken)

  useEffect(() => {
    if (!auth) return
    connect(accessToken)
  }, [auth, connect, accessToken])

  if (!auth) {
    // trở về login và lưu lại đường dẫn hiện tại sau khi login có thể quay lại
    return <Navigate to={ROUTES.LOGIN.url} state={{ from: location.pathname }} replace />
  }


  // render các route con qua Outlet
  return <Outlet />
}

export default AuthGuard
