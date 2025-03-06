import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { LOWSTOCK_MODULE } from "../../../modules/lowstock";
import LowstockModuleService from "../../../modules/lowstock/service";

type CreateLowstockSubscriptionStepInput = {
  variant_id: string;
  sales_channel_id: string;
  email: string;
  user_id?: string;
};

export const createLowstockSubscriptionStep = createStep(
  "create-lowstock-subscription",
  async (input: CreateLowstockSubscriptionStepInput, { container }) => {
    const lowstockModuleService: LowstockModuleService =
      container.resolve(LOWSTOCK_MODULE);

    const lowstockSubscription =
      await lowstockModuleService.createLowstockSubscriptions(input);

    return new StepResponse(lowstockSubscription, lowstockSubscription);
  },
  async (lowstockSubscription, { container }) => {
    const lowstockModuleService: LowstockModuleService =
      container.resolve(LOWSTOCK_MODULE);

    if (lowstockSubscription) {
      await lowstockModuleService.deleteLowstockSubscriptions(
        lowstockSubscription.id
      );
    }
  }
);
