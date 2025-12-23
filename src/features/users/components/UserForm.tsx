import ComboboxRole from "@/features/roles/components/ComboboxRole.tsx";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  PasswordInput,
  PasswordInputAdornmentToggle,
  PasswordInputInput,
} from "@/shared/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Gender } from "@/shared/lib/enum";
import {
  type CreateUser,
  CreateUserSchema,
  type UpdateUser,
  type User,
} from "@/shared/validations/UserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UserFormProps {
  user?: User;
  onSubmit?: (data: CreateUser | UpdateUser) => void;
  isLoading?: boolean;
  mode: "create" | "edit" | "view";
}

export const UserForm = ({
  user,
  onSubmit,
  isLoading,
  mode,
}: UserFormProps) => {
  const form = useForm<CreateUser>({
    resolver: zodResolver(CreateUserSchema) as any,
    defaultValues: {
      fullName: user?.fullName || undefined,
      username: user?.username || undefined,
      password: mode === "edit" ? undefined : mode === "view" ? undefined: "1",
      gender: user?.gender,
      dateOfBirth: user?.dateOfBirth || undefined,
      email: user?.email || undefined,
      phone: user?.phone || undefined,
      currentAddress: user?.currentAddress || undefined,
      roleIds: user?.roles?.map((role) => role.id) || [],
    },
  });

  const handleSubmit = (data: CreateUser) => {
    if (onSubmit) onSubmit(data);
  };

  return (
    <Card className="py-0">
      <CardHeader className="sr-only">
        <CardTitle className="flex items-center gap-2 text-2xl">
          {mode === "create"
            ? "Thêm người dùng mới"
            : mode === "edit"
            ? "Chỉnh sửa người dùng"
            : "Chi tiết người dùng"}
        </CardTitle>
        <CardDescription className="text-base">
          {mode === "create"
            ? "Điền đầy đủ thông tin để tạo tài khoản người dùng mới trong hệ thống"
            : mode === "edit"
            ? "Cập nhật thông tin chi tiết của người dùng"
            : "Xem thông tin chi tiết người dùng"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Thông tin cơ bản
                </h3>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên đầy đủ"
                          {...field}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="w-full"
                            disabled={mode === "view"}
                          >
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={Gender.MALE}>Nam</SelectItem>
                          <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value
                              ? field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : field.value
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(e.target.value || undefined)
                          }
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Thông tin liên hệ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Thông tin liên hệ
                </h3>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          {...field}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập sđt"
                          {...field}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ hiện tại</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ hiện tại"
                          {...field}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Thông tin tài khoản */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">
                  Thông tin tài khoản
                </h3>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập username"
                          {...field}
                          disabled={mode !== "create"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu {mode !== "edit" ? "*" :  ""} </FormLabel>
                      <PasswordInput disabled={mode === "view"}>
                        <FormControl>
                          <PasswordInputInput
                            autoComplete="new-password"
                            placeholder="Nhập mật khẩu"
                            {...field}
                          />
                        </FormControl>
                        <PasswordInputAdornmentToggle />
                      </PasswordInput>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roleIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò</FormLabel>
                      <FormControl>
                        <ComboboxRole
                          values={form.watch("roleIds")}
                          onValuesChange={field.onChange}
                          multiple
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {mode !== "view" && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isDirty}
                >
                  {isLoading
                    ? "Đang xử lý..."
                    : mode === "create"
                    ? "Thêm người dùng"
                    : "Cập nhật thông tin"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
