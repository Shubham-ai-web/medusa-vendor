import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { LOWSTOCK_MODULE } from "src/modules/lowstock"
import LowstockModuleService from "src/modules/lowstock/service"

type UpdateLowstockSubscriptionStepInput = {
    id: string
    user_id?: string
  }
  
  export const updateLowstockSubscriptionStep = createStep(
    "update-lowstock-subscription",
    async ({ id, user_id }: UpdateLowstockSubscriptionStepInput, { container }) => {
      const lowstockModuleService: LowstockModuleService = container.resolve(
        LOWSTOCK_MODULE
      )
  
      const oldData = await lowstockModuleService.retrieveLowstockSubscription(
        id
      )
      const lowstockSubscription = await lowstockModuleService.updateLowstockSubscriptions({
        id,
        user_id: oldData.user_id || user_id,
      })
  
      return new StepResponse(lowstockSubscription, oldData)
    },
    async (lowstockSubscription, { container }) => {
      const lowstockModuleService: LowstockModuleService = container.resolve(
        LOWSTOCK_MODULE
      )
  
      await lowstockModuleService.updateLowstockSubscriptions(lowstockSubscription)
    }
  )