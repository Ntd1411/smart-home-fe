import { useMeQuery } from "@/features/auth/api/AuthService";
import { AlertCircle } from "lucide-react";
import React from "react";
import { type PermissionRequirement, hasPermission } from "../lib/utils";
import LoadingSpinner from "./LoadingSpinner";

/**
 * HOC để bảo vệ page dựa trên permission
 * @param Component - Component cần bảo vệ
 * @param requiredPermission - Permission cần thiết để truy cập page
 */
export function withPermissionGuard<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermission: PermissionRequirement
) {
  const ProtectedComponent = (props: T) => {
    const { data: selfInfo, isLoading, isPending } = useMeQuery();
    const permissions =
      selfInfo?.data?.roles.flatMap((role) => role.permissions) || [];

    // Loading state
    if (isLoading || isPending) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner isLoading={true} className="py-20" />
        </div>
      );
    }

    const hasAccess = hasPermission(permissions, requiredPermission);

    if (!hasAccess) {
      return (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center space-y-4 max-w-md">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Không có quyền truy cập</h2>
              <p className="text-muted-foreground mt-2">
                Bạn không có quyền truy cập tài nguyên này. Vui lòng liên hệ
                quản trị viên để được cấp quyền.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  // Vì React DevTools cần tên rõ ràng
  // HOC bọc component khác -> React mặc định đặt tên component mới là ProtectedComponent hoặc Anonymous
  // hoặc không thấy tên component thật bên trong
  //   Ví dụ bạn dùng:
  // export default withPermissionGuard(UserList)
  // Nếu KHÔNG đặt displayName, React DevTools sẽ hiển thị:
  // ProtectedComponent
  // → khó biết component thật là gì.
  ProtectedComponent.displayName = `withPermissionGuard(${
    Component.displayName || Component.name
  })`;

  return ProtectedComponent;
}
