import { queryClient } from "@/shared/components/ReactQueryProvider"
import api from "@/shared/lib/api"
import API_ROUTES from "@/shared/lib/api-routes"
import { type CreateUser, type UpdateUser, type User, type UsersResponse } from "@/shared/validations/UserSchema"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"


export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // res = {
      //   data: {
      //     users: []
      //   },
      //   headers:
      //   status:
      // }
      const res = await api.get<UsersResponse>(API_ROUTES.USERS);
      return res.data;
    }
  })
}


export const useCreateUserMutation = () => {
  // dùng cho POST, PUT, PATCH, DELETE (xử lý thay đổi dữ liệu).
  return useMutation({
    // hàm sẽ được gọi
    mutationFn: (data: CreateUser) => {
      return api.post<UsersResponse>(API_ROUTES.USERS, data)
    },

    // chạy khi API tạo thành công
    onSuccess: () => {
      // bắt react query refeth lại danh sách users
      // giúp UI luôn có dữ liệu mới nhất 
      queryClient.invalidateQueries({
        queryKey: ['users']
      })
      toast.success("Thêm người dùng thành công")
    },
    onError: (error: any) => {
      toast.error(error.message || "Thên người dùng thất bại")
    }
  })
}

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => api.delete(`${API_ROUTES.USERS}/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Xóa người dùng thành công')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Xóa người dùng thất bại')
    }
  })
}

export const useUpdateUserMutation = (id: String | undefined
) => {
   return useMutation({
    mutationFn: (data: UpdateUser) => {
      return api.patch<UsersResponse>(`${API_ROUTES.USERS}/${id}`, data)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users']
      })
      queryClient.invalidateQueries({queryKey: ['user', id]})
      toast.success("Cập nhật người dùng thành công")
    },
    onError: (error: any) => {
      toast.error(error.message || "Cập nhật người dùng thất bại")
    }
  })
}


export const useGetUserDetailQuery = (id: String | undefined) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => api.get<User>(`${API_ROUTES.USERS}/${id}`),
    // chuyển giá trị id thành kiểu boolean một cách rõ ràng
    // vd: id=0 -> !!!id === false
    enabled: !!id
  })
}