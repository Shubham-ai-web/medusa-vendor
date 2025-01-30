import { z } from "zod"

export const PostAdminCreateVendor = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  address: z.string(),
})
