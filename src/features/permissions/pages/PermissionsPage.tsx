import { useState, useMemo } from "react";
import { Loader2, Pencil, Save, X, ChevronDown } from "lucide-react";

import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useGetPermissionsQuery, useUpdatePermissionNameMutation } from "../api/PermissionService";
import type { PermissionType } from "@/shared/validations/PermissionSchema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { FormPageLayout } from "@/shared/components/FormPageLayout";

const PermissionsPageComponent = () => {
  const { data, isLoading, isFetching } = useGetPermissionsQuery();
  const { mutateAsync: updatePermissionName, isPending } = useUpdatePermissionNameMutation();

  const permissions: PermissionType[] = data?.data || [];

  // Group permissions by module for display
  const groupedPermissions = useMemo(() => {
    const map = new Map<string, PermissionType[]>();
    permissions.forEach((p) => {
      const key = p.module || "Khác";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries()).map(([module, items]) => ({
      module,
      permissions: items,
    }));
  }, [permissions]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState<string>("");

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setNameValue(currentName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNameValue("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await updatePermissionName({ id: editingId, name: nameValue });
    cancelEdit();
  };

  if (isLoading || isFetching) {
    return (
      <FormPageLayout
        title="Quyền"
        description="Danh sách và quản lý quyền trong hệ thống"
      >
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin w-6 h-6" />
        </div>
      </FormPageLayout>
    );
  }

  if (!permissions.length) {
    return (
      <FormPageLayout
        title="Quyền"
        description="Danh sách và quản lý quyền trong hệ thống"
      >
        <p className="text-center text-gray-500">Không có quyền nào.</p>
      </FormPageLayout>
    );
  }

  return (
    <FormPageLayout title="Quyền" description="Danh sách và quản lý quyền trong hệ thống">
      <div className="p-6">
        <div className="space-y-3">
          {groupedPermissions.map((group) => (
            <Collapsible key={group.module}>
              <div className="border border-gray-200 rounded-lg">
                <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 font-semibold">
                  <span>{group.module}</span>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {group.permissions.length} quyền
                    </span>
                    <ChevronDown className="w-4 h-4 data-[state=closed]:hidden" />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="p-4 space-y-3">
                    {group.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex flex-col gap-2 p-3 border rounded-md bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="font-medium">
                            {editingId === permission.id ? (
                              <Input
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                              />
                            ) : (
                              permission.name
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="px-2 py-1 rounded bg-gray-100 uppercase">
                              {permission.method}
                            </span>
                            <span className="font-mono text-xs">{permission.path}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {editingId === permission.id ? (
                            <>
                              <Button size="sm" onClick={saveEdit} disabled={isPending}>
                                {isPending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </Button>
                              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <ComponentWithPermissionGuard
                              permission={PERMISSIONS.PERMISSIONS.UPDATE}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(permission.id, permission.name)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </ComponentWithPermissionGuard>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      </div>
    </FormPageLayout>
  );
};

export const PermissionsPage = withPermissionGuard(
  PermissionsPageComponent,
  PERMISSIONS.PERMISSIONS.LIST
);

