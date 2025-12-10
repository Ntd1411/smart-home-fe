import { z } from 'zod'

export const BaseEntityDTO = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})
