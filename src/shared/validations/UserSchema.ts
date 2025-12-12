import z from "zod";
import { BaseEntityDTO } from "./CommonSchema";
import { Gender } from "../lib/enum";


export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});


export const UserSchema = BaseEntityDTO.extend({
  username: z.string(),
  fullName: z.string(),
  gender: z.enum(Object.values(Gender) as [Gender, ...Gender[]]),               
  dateOfBirth: z.date().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  currentAddress: z.string().nullable().optional(),

  roles: z.array(RoleSchema),
});

export const CreateUserSchema = z
  .object({
    fullName: z.string().min(1, 'Họ và tên không được để trống').max(255, 'Họ và tên không được quá 255 ký tự'),
    username: z.string().min(1, 'Tên đăng nhập không được để trống').max(255, 'Tên đăng nhập không được quá 255 ký tự'),
    password: z
      .string()
      .min(1, 'Mật khẩu không được để trống')
      .max(255, 'Mật khẩu không được quá 255 ký tự')
      .optional(),
    gender: z.enum(Gender, { message: 'Giới tính không hợp lệ' }).optional(),
    dateOfBirth: z.coerce.date().optional(),
    phone: z.string().max(20, 'Số điện thoại không được quá 20 ký tự').optional(),
    email: z.string().optional(),
    currentAddress: z.string().optional(),
    roleIds: z.array(z.string()).optional(),
  })
  .strict()
  .strip()

export const UpdateUserSchema = CreateUserSchema


export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
}).strip()

export type User = z.infer<typeof UserSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;