import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { MedusaError } from "@medusajs/framework/utils";
import { createLowstockSubscriptionWorkflow } from "src/workflows/create-lowstock-subscription";

type PostStoreCreateLowstockSubscription = {
  variant_id: string;
  email?: string;
  sales_channel_id?: string;
};

export async function POST(
  req: AuthenticatedMedusaRequest<PostStoreCreateLowstockSubscription>,
  res: MedusaResponse
) {
  const salesChannelId =
    req.validatedBody.sales_channel_id ||
    (req.publishable_key_context?.sales_channel_ids?.length
      ? req.publishable_key_context?.sales_channel_ids[0]
      : undefined);
  // if (!salesChannelId) {
  //   throw new MedusaError(
  //     MedusaError.Types.INVALID_DATA,
  //     "At least one sales channel ID is required, either associated with the publishable API key or in the request body."
  //   )
  // }
  if (!salesChannelId) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The stock for this variant is low. Please restock soon."
    );
  }
  const { result } = await createLowstockSubscriptionWorkflow(req.scope).run({
    input: {
      variant_id: req.validatedBody.variant_id,
      sales_channel_id: salesChannelId,
      user: {
        email: req.validatedBody.email,
        user_id: req.auth_context?.actor_id,
      },
    },
  });

  return res.sendStatus(201);
}
