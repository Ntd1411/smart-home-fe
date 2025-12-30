import { useState } from "react";
import { Eye, Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/shared/components/ui/button";
import ROUTES from "@/shared/lib/routes";
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";
import { useDeleteRoleMutation, useGetRolesQuery } from "../api/RoleService";
import { FormPageLayout } from "@/shared/components/FormPageLayout";

const RolePageComponent = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetRolesQuery();
  const { mutateAsync: deleteRole } = useDeleteRoleMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const roles = data?.data?.data || [];

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn chắc chắn muốn xóa vai trò này?");
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await deleteRole(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || isFetching) {
    return (
      <FormPageLayout title="Vai trò" description="Danh sách vai trò trong hệ thống">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      </FormPageLayout>
    );
  }

  if (!roles.length) {
    return (
      <FormPageLayout title="Vai trò" description="Danh sách vai trò trong hệ thống">
        <p className="text-center text-gray-500">Không có role nào.</p>
      </FormPageLayout>
    );
  }

  return (
    <FormPageLayout title="Vai trò" description="Danh sách vai trò trong hệ thống">
      <div className="p-6">
        <div className="flex items-center justify-end mb-4">
          <ComponentWithPermissionGuard permission={PERMISSIONS.ROLES.CREATE}>
            <Button onClick={() => navigate(ROUTES.ROLE_CREATE.url)}>
              <Plus className="w-4 h-4 mr-2" /> Thêm vai trò
            </Button>
          </ComponentWithPermissionGuard>
        </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-center">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2 border text-center">#</th>
              <th className="p-2 border text-center">Tên vai trò</th>
              <th className="p-2 border text-center">Mô tả</th>
              <th className="p-2 border text-center">Trạng thái</th>
              <th className="p-2 border text-center">Loại</th>
            </tr>
          </thead>

          <tbody className="[&>tr>td]:align-middle">
            {roles.map((role, idx) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="p-2 border w-12 text-center">{idx + 1}</td>
                <td className="p-2 border">{role.name}</td>
                <td className="p-2 border">{role.description || "-"}</td>
                <td className="p-2 border">
                  {role.isActive ? "Đang hoạt động" : "Không hoạt động"}
                </td>
                <td className="p-2 border">
                  {role.isSystemRole ? "Hệ thống" : "Tùy chỉnh"}
                </td>
                <td className="p-2 border">
                  <div className="flex items-center gap-2 justify-center">
                    <ComponentWithPermissionGuard
                      permission={PERMISSIONS.ROLES.VIEW}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(ROUTES.ROLE_VIEW.getPath(role.id))
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </ComponentWithPermissionGuard>
                    {!role.isSystemRole && (
                      <>
                        <ComponentWithPermissionGuard
                          permission={PERMISSIONS.ROLES.UPDATE}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(ROUTES.ROLE_EDIT.getPath(role.id))
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </ComponentWithPermissionGuard>

                        <ComponentWithPermissionGuard
                          permission={PERMISSIONS.ROLES.DELETE}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            disabled={deletingId === role.id}
                            onClick={() => handleDelete(role.id)}
                          >
                            {deletingId === role.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash className="w-4 h-4" />
                            )}
                          </Button>
                        </ComponentWithPermissionGuard>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </FormPageLayout>
  );
};

export const RolePage = withPermissionGuard(
  RolePageComponent,
  PERMISSIONS.ROLES.LIST
);
