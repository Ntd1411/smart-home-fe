import { z } from 'zod'
import { BaseEntityDTO } from './CommonSchema'


export const PermissionSchema = BaseEntityDTO.extend({
  name: z.string(),
  description: z.string(),
  path: z.string(),
  method: z.string(),
  module: z.string()
})

export type PermissionType = z.infer<typeof PermissionSchema>
