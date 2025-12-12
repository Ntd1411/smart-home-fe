import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import {
  type LoginResponse,
  type LoginBodyType,
  type MeResponse,
} from '@/shared/validations/AuthSchema'
import { useMutation, useQuery } from '@tanstack/react-query'
import useAuthStore from '../stores/authStore'
import { toast } from 'sonner'
import { queryClient } from '@/shared/components/ReactQueryProvider'


export const useLoginMutation = () => {
  const login = useAuthStore(state => state.login);
  return useMutation({
    mutationFn: (body: LoginBodyType) => api.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, body),
    onSuccess: async (data) => {
      await login(data.data);
      toast.success("Đăng nhập thành công.")
    },
    onError: (error: any) => {
      toast.error(error.message || "Đăng nhập thất bại.")
    }
  })
}


export const useMeQuery = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const response = await api.get<MeResponse>(API_ROUTES.AUTH.ME)
        return response
      } catch (error: any) {
        return null
      }
    }
  })
}


export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout)
  return useMutation({
    mutationFn: (refreshToken: string) => api.post(API_ROUTES.AUTH.LOGOUT, { refreshToken }),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Đăng xuất thành công.')
    },
    onError: (error: any) => {
      logout()
      queryClient.clear()
      toast.error(error.message || 'Đăng xuất thất bại.')
    }
  })
}