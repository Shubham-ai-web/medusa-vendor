import { InferTypeOf } from "@medusajs/framework/types"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { LOWSTOCK_MODULE } from "../../../modules/lowstock"
import LowstockSubscription from "../../../modules/lowstock/models/lowstock-subscription"
import LowstockModuleService from "../../../modules/lowstock/service"

type DeleteLowstockSubscriptionsStepInput = InferTypeOf<typeof LowstockSubscription>[]

export const deleteLowstockSubscriptionStep = createStep(
  "delete-lowstock-subscription",
  async (
    lowstockSubscriptions: DeleteLowstockSubscriptionsStepInput,
    { container }
  ) => {
    const lowstockModuleService: LowstockModuleService = container.resolve(
      LOWSTOCK_MODULE
    )

    // await lowstockModuleService.deleteLowstockSubscriptions(
    //   lowstockSubscriptions.map((subscription) => subscription.id)
    // )

    return new StepResponse(undefined, lowstockSubscriptions)
  },
  async (lowstockSubscriptions, { container }) => {
    if (!lowstockSubscriptions) {
      return
    }

    const restockModuleService: LowstockModuleService = container.resolve(
      LOWSTOCK_MODULE
    )

    await restockModuleService.createLowstockSubscriptions(lowstockSubscriptions)
  }
)