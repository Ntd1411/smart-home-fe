
const ROUTES = {
  HOME: {
    title: 'Trang chủ',
    url: '/'
  },
  ACCOUNTS: {
    title: 'Tài khoản',
    url: '/accounts'
  },
  LOGIN: {
    title: 'Đăng nhập',
    url: '/login'
  },
  USER_CREATE: {
    title: 'Thêm nhân viên',
    url: '/users/create'
  },
  USER_EDIT: {
    title: 'Sửa nhân viên',
    url: `/users/:id/edit`,
    getPath: (id: string) => `/users/${id}/edit`
  },
  USER_VIEW: {
    title: 'Chi tiết nhân viên',
    url: `/users/:id/view`,
    getPath: (id: string) => `/users/${id}/view`
  },
  PERMISSIONS: {
    title: 'Phân quyền',
    url: '/permissions'
  },
  ROLES: {
    title: 'Vai trò',
    url: '/roles'
  },
  ROLE_EDIT: {
    title: 'Sửa vai trò',
    url: '/roles/:id/edit',
    getPath: (id: string) => `/roles/${id}/edit`
  },
  ROLE_CREATE: {
    title: 'Tạo vai trò',
    url: '/roles/create'
  },
  AUDIT_LOGS: {
    title: 'Lịch sử hoạt động',
    url: '/audit-logs'
  },
}

export default ROUTES
