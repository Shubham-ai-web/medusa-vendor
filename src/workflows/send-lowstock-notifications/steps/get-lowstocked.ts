import { getVariantAvailability, promiseAll } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

type GetLowstockedStepInput = {
  variant_id: string
  sales_channel_id: string
}[]

export const getLowstockedStep = createStep(
  "get-lowstocked",
  async (input: GetLowstockedStepInput, { container }) => {
    const lowstocked: GetLowstockedStepInput = []
    const query = container.resolve("query")

    await promiseAll(
      input.map(async (lowstockSubscription) => {
        const variantAvailability = await getVariantAvailability(query, {
          variant_ids:      [ lowstockSubscription.variant_id ],
          sales_channel_id: lowstockSubscription.sales_channel_id,
        })

        // if (variantAvailability[lowstockSubscription.variant_id].availability > 0) {
        //   lowstocked.push(lowstockSubscription)
        // }

        if (variantAvailability[lowstockSubscription.variant_id].availability <= 10) {
          lowstocked.push(lowstockSubscription)
        }
      })
    )

    return new StepResponse(lowstocked)
  }
)