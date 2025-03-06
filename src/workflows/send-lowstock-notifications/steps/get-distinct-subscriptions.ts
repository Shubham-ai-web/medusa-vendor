import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { LOWSTOCK_MODULE } from "../../../modules/lowstock"
import LowstockModuleService from "../../../modules/lowstock/service"

export const getDistinctSubscriptionsStep = createStep(
  "get-distinct-subscriptions",
  async (_, { container }) => {
    const lowstockModuleService: LowstockModuleService = container.resolve(
      LOWSTOCK_MODULE
    )

    const distinctSubscriptions = await lowstockModuleService.getUniqueSubscriptions()

    return new StepResponse(distinctSubscriptions)
  }
)