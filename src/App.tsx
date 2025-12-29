import { createBrowserRouter, RouterProvider } from "react-router";
import ROUTES from "./shared/lib/routes";
import AuthGuard from "./features/auth/components/AuthGuard";
import { authLoader } from "./features/auth/api/AuthLoader";
import LayoutMain from "./shared/layouts/LayoutMain";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import NotFoundPage from "./shared/pages/NotFoundPage";
import { ReactQueryProvider } from "./shared/components/ReactQueryProvider";
import { Toaster } from "sonner";
import GlobalLoadingProvider from "./shared/components/GlobalLoading";
import LoginPage from "./features/auth/pages/LoginPage";
import {UserPage} from "./features/users/page/UserPage";
import {UserViewPage} from "./features/users/page/UserViewPage";
import {RolePage} from "./features/roles/pages/RolePage";
import { RoleViewPage } from "./features/roles/pages/RoleViewPage";
import { RoleEditPage } from "./features/roles/pages/RoleEditPage";
import { UserEditPage } from "./features/users/page/UserEditPage";
import { UserCreatePage } from "./features/users/page/UserCreatePage";
import { RoleCreatePage } from "./features/roles/pages/RoleCreatePage";
import { OverviewPage } from "./features/overview/pages/OverviewPage";
import { RoomDetailPage } from "./features/rooms/pages/RoomDetailPage";
import { GeneralSettingPage } from "./features/setting/pages/GeneralSettingPage";
import { PermissionsPage } from "./features/permissions/pages/PermissionsPage";
import ProfilePage from "./features/auth/pages/ProfilePage";
import { NotificationPage } from "./features/notifications/page/NotificationPage";

const router = createBrowserRouter([
  {
    loader: authLoader,
    element: <AuthGuard />,
    children: [
      {
        path: ROUTES.HOME.url,
        element: <LayoutMain />,
        children: [
          {
            path: ROUTES.USERS.url,
            element: <UserPage/>
          },
          {
            path: ROUTES.USER_CREATE.url,
            element: <UserCreatePage />
          },
          {
            path: ROUTES.USER_EDIT.url,
            element: <UserEditPage />
          },
          {
            path: ROUTES.USER_VIEW.url,
            element: <UserViewPage />
          },
          {
            path: ROUTES.PERMISSIONS.url,
            element: <PermissionsPage />
          },
          {
            path: ROUTES.ROLES.url,
            element: <RolePage />
          },
          {
            path: ROUTES.ROLE_VIEW.url,
            element: <RoleViewPage />
          },

          {
            path: ROUTES.ROLE_EDIT.url,
            element: <RoleEditPage />
          },
          {
            path: ROUTES.ROLE_CREATE.url,
            element: <RoleCreatePage />
          },
          // {
          //   path: ROUTES.AUDIT_LOGS.url,
          //   element: <AuditLogsPage />
          // },
          {
            path: ROUTES.OVERVIEW.url,
            element: <OverviewPage />
          },
          {
            path: ROUTES.ROOM_DETAIL.url,
            element: <RoomDetailPage />
          },
          {
            path: ROUTES.GENERAL_SETTING.url,
            element: <GeneralSettingPage />          
          },
          {
            path: ROUTES.NOTIFICATION.url,
            element: <NotificationPage />
          },
          {
            path: ROUTES.PROFILE.url,
            element: <ProfilePage />
          }
        ]
      }
    ]
  },
  {
    path: ROUTES.LOGIN.url,
    element: (
      <ErrorBoundary>
        <LoginPage />
      </ErrorBoundary>
    )
  },
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <NotFoundPage />
      </ErrorBoundary>
    )
  }
])

export default function App() {
  return (
    <ReactQueryProvider>
      <GlobalLoadingProvider>
          <RouterProvider router={router} />
      </GlobalLoadingProvider>
      <Toaster position='top-right' richColors theme='light' />
    </ReactQueryProvider>
  )
}
