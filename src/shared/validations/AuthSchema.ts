import z from 'zod'
import { PermissionSchema } from './PermissionSchema'

export const LoginSchema = z
  .object({
    username: z.string().trim().min(1, 'Tên đăng nhập không được để trống'),
    password: z.string().trim().min(1, 'Mật khẩu không được để trống')
  })
  .strict()
  .strip()

export type LoginBodyType = z.infer<typeof LoginSchema>

export const LogoutSchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()
  .strip()

export type LogoutBodyType = z.infer<typeof LogoutSchema>

export const RefreshTokenSchema = z
  .object({
    refreshToken: z.string()
  })
  .strict()
  .strip()

export type RefreshTokenBodyType = z.infer<typeof RefreshTokenSchema>

export const LoginResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
  .strip()

export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const RefreshTokenResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
  .strip()

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>


export const MeResponseSchema = z
  .object({
    id: z.string(),
    username: z.string(),
    fullName: z.string(),
    facultyDepartmentId: z.string(),
    code: z.string(),
    facultyDepartment: z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
      isFaculty: z.boolean()
    }),
    roles: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        isActive: z.boolean(),
        isSystemRole: z.boolean(),
        scopeFacultyDepartment: z
          .object({
            id: z.string(),
            name: z.string()
          })
          .nullable()
          .default(null),
        permissions: z.array(PermissionSchema)
      })
    )
  })
  .strip()

export type MeResponse = z.infer<typeof MeResponseSchema>
