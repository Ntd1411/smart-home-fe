import { useNavigate } from "react-router"
import { useCreateUserMutation } from "../api/UserService"
import ROUTES from "@/shared/lib/routes"
import type { CreateUser } from "@/shared/validations/UserSchema"
import { FormPageLayout } from "../../../shared/components/FormPageLayout"
import { UserForm } from "../components/UserForm"


const UserCreatePage = () => {
  const { mutateAsync, isPending} = useCreateUserMutation()
  const navigate = useNavigate()

  const handleSubmit = async (data: CreateUser) => {
    await mutateAsync(data)
    navigate(ROUTES.USERS.url)
  }

  return (
    <FormPageLayout title='Thêm người dùng mới' description='Điền thông tin để tạo người dùng'>
      <UserForm mode='create' onSubmit={handleSubmit} isLoading={isPending} />
    </FormPageLayout>
  )
}

// Apply permission guard
// export const UserCreatePage = withPermissionGuard(UserCreatePageComponent, PERMISSIONS.USERS.CREATE)
export default UserCreatePage
