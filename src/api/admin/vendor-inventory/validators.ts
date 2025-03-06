import { z } from "zod";

export const AdminGetVendorInventoryReq = z.object({
  inventory_item_id: z.string(),
  limit:             z.string(),
  offset:            z.string(),
  order:             z.ostring(),
});

export const AdminPostVendorInventoryReq = z.object({
  vendor:            z.string(),
  inventory_item_id: z.string(),
  price:             z.number(),
  turnaround_days:   z.number(),
  is_preferred:      z.boolean().optional().default(false),
});

export const AdminPutVendorInventoryReq = z.object({
  inventory_item_id: z.string().optional(),
  price:             z.number(),
  turnaround_days:   z.number(),
  is_preferred:      z.boolean(),
  vendor:            z.string().nullable().optional(),
});

export type AdminGetVendorInventoryReqType = z.infer<typeof AdminGetVendorInventoryReq>;
export type AdminPostVendorInventoryReqType = z.infer<typeof AdminPostVendorInventoryReq>;
export type AdminPutVendorInventoryReqType = z.infer<typeof AdminPutVendorInventoryReq>;