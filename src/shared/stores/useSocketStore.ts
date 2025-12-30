// stores/socketStore.ts

// File này tạo ra một global store (Zustand):
  // Quản lý một instance Socket.IO duy nhất (Tránh tạo nhiều kết nối trùng).
  // Theo dõi trạng thái kết nối (isConnected, isConnecting, error).
  // Kết nối socket bằng JWT token
  // Xử lý reconnect, lỗi kết nối, lỗi xác thực
  // Hiển thị thông báo lỗi cho người dùng bằng sonner toast
  // Đảm bảo không kết nối nhiều lần khi đã đang kết nối.
import { io, type Socket } from 'socket.io-client'
import { toast } from 'sonner'
import { create } from 'zustand'
import envConfig from '../config/envConfig'

const getAccessTokenFromAuthStorage = (): string | null => {
  try {
    const raw = localStorage.getItem('auth-storage')
    if (!raw) return null

    const parsed = JSON.parse(raw) as { state?: { token?: { accessToken?: string } } }
    return parsed?.state?.token?.accessToken ?? null
  } catch {
    return null
  }
}

interface SocketState {
  socket: Socket | null  // instance socket hiện tại
  isConnected: boolean
  isConnecting: boolean  // đang trong qtr kết nối (để tránh gọi nhiều lần).
  error: string | null
  connect: (token?: string) => void  // connect, disconnect, setter thủ công
  disconnect: () => void
  setConnected: (connected: boolean) => void
  setError: (error: string | null) => void
  setConnecting: (connecting: boolean) => void
}

// set: hàm để cập nhật state
// get: hàm lấy state hiện tại (rất hữu ích để kiểm tra trước khi connect).
export const useSocketStore = create<SocketState>()((set, get) => ({
  // state mặc định khi chưa kết nối gì 
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  connect: (token?: string) => {
    const { socket, isConnected } = get()

    // nếu đã kết nối rồi -> không làm gì
    if (socket && isConnected) {
      return
    }

    // nếu đang kết nối -> không cho connect lại (tránh spam)
    if (get().isConnecting) {
      return
    }

    // trong quá trình kết nối
    set({ isConnecting: true, error: null })

    try {
      const accessToken = token ?? getAccessTokenFromAuthStorage()

      if (!accessToken) {
        toast.error('Thiếu token để kết nối socket!', {
          description: 'Vui lòng đăng nhập lại để tiếp tục sử dụng realtime.'
        })
        set({ isConnecting: false, error: 'Thiếu token để kết nối socket!' })
        return
      }

      // tạo socket instance
      const newSocket = io(`${envConfig.VITE_SOCKET_URL}`, {
        auth: { token: accessToken }, // Gửi accessToken để server xác thực
        path: '/ws/socket.io', // Đường dẫn socket (thường dùng khi có reverse proxy)
        transports: ['websocket'], // chỉ dùng websocket (không fallback polling)
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      // Event listeners

      // connect: khi kết nối thành công
      newSocket.on('connect', () => {
        set({
          isConnected: true,
          isConnecting: false,
          error: null,
          socket: newSocket
        })
      })


      // mất kết nối
      newSocket.on('disconnect', (reason: any) => {
        set({
          isConnected: false,
          isConnecting: false,
          error: reason === 'io server disconnect' ? 'Server disconnected' : null
        })
      })


      // lỗi kết nối
      newSocket.on('connect_error', (err: any) => {
        // Backend rejects handshake with Error('auth_error') when JWT is missing/invalid.
        if (err?.message === 'auth_error') {
          toast.error('Lỗi xác thực khi kết nối socket!', {
            description: 'Vui lòng kiểm tra lại thông tin đăng nhập và thử đăng nhập lại.'
          })
          set({
            isConnected: false,
            isConnecting: false,
            error: 'Lỗi xác thực khi kết nối socket!'
          })
          return
        }

        toast.error('Lỗi kết nối socket!', {
          description: 'Vui lòng kiểm tra lại kết nối internet và thử đăng nhập lại.'
        })
        set({
          isConnected: false,
          isConnecting: false,
          error: 'Lỗi kết nối socket!'
        })
      })

      set({ socket: newSocket })
    } catch {
      toast.error('Lỗi kết nối socket!', {
        description: 'Vui lòng kiểm tra lại kết nối internet và thử đăng nhập lại.'
      })
      set({
        isConnecting: false,
        error: 'Lỗi kết nối socket!'
      })
    }
  },

  // dùng khi logout, chuyển tài khoản, hoặc rời app
  disconnect: () => {
    const { socket } = get()

    if (socket) {
      socket.disconnect()
      set({
        socket: null,
        isConnected: false,
        isConnecting: false,
        error: null
      })
    }
  },

  // các setter thủ công
  // dành cho các component khác có thể cập nhật state nếu cần (ví dụ từ bên ngoài).
  setConnected: (connected: boolean) => set({ isConnected: connected }),
  setError: (error: string | null) => set({ error }),
  setConnecting: (connecting: boolean) => set({ isConnecting: connecting })
}))


// VD:
//   const { connect, disconnect, isConnected } = useSocketStore()

// // Khi login thành công
// connect(tokenFromLogin)

// // Khi logout
// disconnect()

// // Hiển thị trạng thái
// {isConnected ? '🟢 Đang kết nối' : '🔴 Mất kết nối'}