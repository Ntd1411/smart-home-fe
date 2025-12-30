import { useState } from "react";
import { Eye, Loader2, Pencil, Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/shared/components/ui/button";
import { useGetUsersQuery, useDeleteUserMutation } from "../api/UserService";
import ROUTES from "@/shared/lib/routes";
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";
import { FormPageLayout } from "@/shared/components/FormPageLayout";

const UserPageComponent = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetUsersQuery();
  const { mutateAsync: deleteUser } = useDeleteUserMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const users = data?.users || [];

  const formatDate = (value?: Date | string) => {
    if (!value) return "---";
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString("vi-VN");
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Bạn chắc chắn muốn xóa người dùng này?");
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await deleteUser(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || isFetching) {
    return (
      <FormPageLayout
        title="Quản lý người dùng"
        description="Danh sách tất cả người dùng trong hệ thống"
      >
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      </FormPageLayout>
    );
  }

  if (!users.length) {
    return (
      <FormPageLayout
        title="Quản lý người dùng"
        description="Danh sách tất cả người dùng trong hệ thống"
      >
        <p className="text-center text-gray-500">Không có user nào.</p>
      </FormPageLayout>
    );
  }

  return (
    <FormPageLayout
      title="Quản lý người dùng"
      description="Danh sách tất cả người dùng trong hệ thống"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <ComponentWithPermissionGuard permission={PERMISSIONS.USERS.CREATE}>
            <Button onClick={() => navigate(ROUTES.USER_CREATE.url)}>
              <Plus className="w-4 h-4 mr-2" /> Thêm người dùng
            </Button>
          </ComponentWithPermissionGuard>
        </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-center">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2 border text-center">#</th>
              <th className="p-2 border text-center">Username</th>
              <th className="p-2 border text-center">Họ tên</th>
              <th className="p-2 border text-center">Giới tính</th>
              <th className="p-2 border text-center">Email</th>
              <th className="p-2 border text-center">SĐT</th>
              <th className="p-2 border text-center">Vai trò</th>
              <th className="p-2 border text-center">Ngày tạo</th>
              <th className="p-2 border text-center">Hành động</th>
            </tr>
          </thead>

          <tbody className="[&>tr>td]:align-middle">
            {users.map((user, idx) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border w-12 text-center">{idx + 1}</td>
                <td className="p-2 border">{user.username}</td>
                <td className="p-2 border">{user.fullName}</td>
                <td className="p-2 border text-center">
                  {user.gender === "MALE" ? "Nam" : "Nữ"}
                </td>
                <td className="p-2 border">{user.email || "-"}</td>
                <td className="p-2 border">{user.phone || "-"}</td>
                <td className="p-2 border">
                  {user.roles.map((r) => r.name).join(", ") || "-"}
                </td>
                <td className="p-2 border">{formatDate(user.createdAt)}</td>
                <td className="p-2 border">
                  <div className="flex items-center gap-2 justify-center">
                    <ComponentWithPermissionGuard
                      permission={PERMISSIONS.USERS.VIEW}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(ROUTES.USER_VIEW.getPath(user.id))
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </ComponentWithPermissionGuard>
                    {!user.roles.some((role) => role.name === "admin") && (
                      <>
                        <ComponentWithPermissionGuard
                          permission={PERMISSIONS.USERS.UPDATE}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(ROUTES.USER_EDIT.getPath(user.id))
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </ComponentWithPermissionGuard>
                        <ComponentWithPermissionGuard
                          permission={PERMISSIONS.USERS.DELETE}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            disabled={deletingId === user.id}
                            onClick={() => handleDelete(user.id)}
                          >
                            {deletingId === user.id ? (
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

export const UserPage = withPermissionGuard(
  UserPageComponent,
  PERMISSIONS.USERS.LIST
);
