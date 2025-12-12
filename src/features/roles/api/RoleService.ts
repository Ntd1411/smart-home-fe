import api from "@/shared/lib/api"
import API_ROUTES from "@/shared/lib/api-routes"
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query"
import type { GetRoleQueryType, PaginationRoleResponseType } from "@/shared/validations/RoleSchema"
import { normalizeObject } from "@/shared/lib/utils"



export const useGetRoleInfinite = (query: Partial<GetRoleQueryType>) => {
  return useInfiniteQuery({
    queryKey: ['roles', normalizeObject(query)],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<PaginationRoleResponseType>(`${API_ROUTES.ROLES}`, {
        params: normalizeObject({
          ...query,
          page: pageParam
        })
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage?.meta
      return page < totalPages ? page + 1 : undefined
    }
  })
}
