import {useParams } from "react-router";
import {
  useGetUserDetailQuery,
} from "../api/UserService";
import { FormPageLayout } from "../../../shared/components/FormPageLayout";
import { UserForm } from "../components/UserForm";

const UserViewPage = () => {
  // lấy id người dùng đó
  const { id } = useParams();
  const { data: userResponse, isLoading } = useGetUserDetailQuery(id);  

  return (
    <FormPageLayout
      title="Xem chi tiết người dùng"
      description={`Xem thông tin người dùng: ${
        userResponse?.data.fullName || ""
      }`}
      isLoading={isLoading}
      notFoundMessage={!userResponse ? "Không tìm thấy người dùng" : undefined}
    >
      {userResponse && (
        <UserForm
          mode="view"
          user={userResponse?.data}
        />
      )}
    </FormPageLayout>
  );
};

// Apply permission guard
// export const UserCreatePage = withPermissionGuard(UserCreatePageComponent, PERMISSIONS.USERS.CREATE)
export default UserViewPage;
