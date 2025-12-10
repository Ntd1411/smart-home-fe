import api from '@/shared/lib/api'
import API_ROUTES from '@/shared/lib/api-routes'
import type {
  MeResponse,
} from '@/shared/validations/AuthSchema'
import { useQuery } from '@tanstack/react-query'




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
