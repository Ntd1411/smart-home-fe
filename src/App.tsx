import { createBrowserRouter } from "react-router";
import ROUTES from "./shared/lib/routes";
import AuthGuard from "./features/auth/components/AuthGuard";
import { authLoader } from "./features/auth/api/AuthLoader";
import LayoutMain from "./shared/layouts/LayoutMain";

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
            element: <RolesPage />
          },
          {
            path: ROUTES.ROLE_EDIT.url,
            element: <RoleEditPage />
          },
          {
            path: ROUTES.ROLE_CREATE.url,
            element: <RoleCreatePage />
          },
          {
            path: ROUTES.AUDIT_LOGS.url,
            element: <AuditLogsPage />
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
        <SocketProvider>
          <RouterProvider router={router} />
          <ImagePreviewDialog />
        </SocketProvider>
      </GlobalLoadingProvider>
      <Toaster position='top-right' richColors theme='light' />
    </ReactQueryProvider>
  )
}
