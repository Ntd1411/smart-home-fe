import z from "zod"
import { UserSchema } from "./UserSchema"
import { PermissionSchema } from "./PermissionSchema"
import { BaseEntityDTO, MetaPagination } from "./CommonSchema"


export const RoleSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string(),
  isActive: z.boolean().default(true),
  isSystemRole: z.boolean().default(false),
  permissions: z.array(PermissionSchema),
  users: z.array(UserSchema)
})

export const PaginationRoleResponseSchema = z.object({
  data: z.array(RoleSchema),
  meta: MetaPagination
})

export const GetRoleQuerySchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isSystemRole: z.boolean().optional(),
})

export type PaginationRoleResponseType = z.infer<typeof PaginationRoleResponseSchema>
export type GetRoleQueryType = z.infer<typeof GetRoleQuerySchema>