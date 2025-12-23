import api from "@/shared/lib/api";
import API_ROUTES from "@/shared/lib/api-routes";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { PermissionType } from "@/shared/validations/PermissionSchema";
import { queryClient } from "@/shared/components/ReactQueryProvider";
import { toast } from "sonner";

export const useGetPermissionsQuery = () => {
  return useQuery({
    queryKey: ["permissions:list"],
    queryFn: () => api.get<PermissionType[]>(API_ROUTES.PERMISSIONS),
  });
};

export const useUpdatePermissionNameMutation = () => {
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.patch(`${API_ROUTES.PERMISSIONS}/${id}`, { name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["permissions:list"] });
      await queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Cập nhật tên quyền thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Cập nhật tên quyền thất bại");
    },
  });
};

