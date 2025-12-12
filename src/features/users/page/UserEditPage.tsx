import { useNavigate, useParams } from "react-router";
import {
  useGetUserDetailQuery,
  useUpdateUserMutation,
} from "../api/UserService";
import type { UpdateUser } from "@/shared/validations/UserSchema";
import { FormPageLayout } from "../../../shared/components/FormPageLayout";
import { UserForm } from "../components/UserForm";

const UserCreatePage = () => {
  // lấy id người dùng đó
  const { id } = useParams();
  const { data: userResponse, isLoading } = useGetUserDetailQuery(id);
  const { mutateAsync, isPending } = useUpdateUserMutation(id || "");
  const navigate = useNavigate();

  const handleSubmit = async (data: UpdateUser) => {
    await mutateAsync(data);
    // đi ngược lại 1 trang trong lịch sử trình duyệt (giống nút back).
    navigate(-1);
  };

  

  return (
    <FormPageLayout
      title="Cập nhật người dùng"
      description={`Cập nhật thông tin người dùng: ${
        userResponse?.data.fullName || ""
      }`}
      isLoading={isLoading}
      notFoundMessage={!userResponse ? "Không tìm thấy người dùng" : undefined}
    >
      {userResponse && (
        <UserForm
          mode="edit"
          onSubmit={handleSubmit}
          isLoading={isPending}
          user={userResponse?.data}
        />
      )}
    </FormPageLayout>
  );
};

// Apply permission guard
// export const UserCreatePage = withPermissionGuard(UserCreatePageComponent, PERMISSIONS.USERS.CREATE)
export default UserCreatePage;
