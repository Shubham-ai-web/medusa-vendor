import { z } from "zod";

export const PostAdminCreateVendor = z.object({
  first_name:   z.string(),
  last_name:    z.string(),
  email:        z.string(),
  phone:        z.string().optional(),
  address:      z.string(),
  address2:     z
                  .string()
                  .nullable()
                  .transform((val) => val ?? ""),
  city:         z.string(),
  state:        z.string(),
  country:      z.string(),
  postal_code:  z.string().optional(),
  company_name: z.string().optional(),
  tax_id:       z.string().optional(),
});

export type PostAdminUpdateVendorType = z.infer<typeof PostAdminUpdateVendor>;
export const PostAdminUpdateVendor = z.object({
  first_name:   z.string(),
  last_name:    z.string(),
  email:        z.string(),
  phone:        z.string().optional(),
  address:      z.string(),
  address2:     z
                  .string()
                  .nullable()
                  .transform((val) => val ?? ""),
  city:         z.string(),
  state:        z.string(),
  country:      z.string(),
  postal_code:  z.string().optional(),
  company_name: z.string().optional(),
  tax_id:       z.string().optional(),
});
