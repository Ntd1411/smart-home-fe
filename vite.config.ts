// file cấu hình vite


import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// vite gọi hàm này khi khởi tạo
// mode là chuỗi như "development" (npm run dev), "production" (vite build)
export default defineConfig(({ mode }) => {
  // đọc file .env tương ứng mode
  // vd: mode = "development" -> đọc .env, .env.development (theo thứ tự ưu tiên)
  // process.cwd() là folder dự án
  // '' không lọc -> lấy tất biến trong file .env
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // bật plugin React và Tailwind
    plugins: [react(), tailwindcss()],
    resolve: {
      // tạo alias cho import đường dẫn -> vite sẽ hiểu 
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    // cấu hình cho development server (vite dev)
    // server: {
    //   // bật CORS (cho phép trình duyệt truy vấn từ origin khác)
    //   cors: true,
    //   // thêm header này vào response dev server- cho phép mọi origin truy cập (chỉ nên dùng ở dev)
    //   headers: {
    //     'Access-Control-Allow-Origin': '*'
    //   },
    //   // cấu hình proxy để forward các request từ dev server tới backend
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_API_URL,
    //       // khi proxy request, header Host sẽ thay đổi thành host của target. Thường cần khi server đích kiểm tra host
    //       changeOrigin: true
    //     }
    //   }
    // }
  }
})
