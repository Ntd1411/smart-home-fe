
const ROUTES = {
  HOME: {
    title: 'Trang chủ',
    url: '/'
  },
  LOGIN: {
    title: 'Đăng nhập',
    url: '/login'
  },
  USERS: {
    title: 'Danh sách người dùng',
    url: '/users'
  },
  USER_CREATE: {
    title: 'Thêm người dùng',
    url: '/users/create'
  },
  USER_EDIT: {
    title: 'Sửa người dùng',
    url: `/users/:id/edit`,
    getPath: (id: string) => `/users/${id}/edit`
  },
  USER_VIEW: {
    title: 'Chi tiết người dùng',
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
  ROLE_VIEW: {
    title: 'Xem vai trò',
    url: '/roles/:id/view',
    getPath: (id: string) => `/roles/${id}/view`
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
  OVERVIEW: {
    title: 'Trang tổng quát',
    url: '/overview'
  },
  ROOM_DETAIL: {
    title: 'Chi tiết phòng',
    url: '/rooms/:location',
    getPath: (location: string) => `/rooms/${location}`
  },
  LIVING_ROOM: {
    title: 'Phòng khách',
    url: '/rooms/living-room',
  },
  BED_ROOM: {
    title: 'Phòng ngủ',
    url: '/rooms/bedroom',
  },
  SETTING: {
    title: "Cài đặt",
    url: '/settings'
  },
  PROFILE: {
    title: "Hồ sơ cá nhân",
    url: '/profile'
  }

}

export default ROUTES
