import { z } from "zod"

type PostStoreCreateLowstockSubscription = z.infer<
  typeof PostStoreCreateLowstockSubscription
>
export const PostStoreCreateLowstockSubscription = z.object({
  variant_id:       z.string(),
  email:            z.string().optional(),
  sales_channel_id: z.string().optional(),
})