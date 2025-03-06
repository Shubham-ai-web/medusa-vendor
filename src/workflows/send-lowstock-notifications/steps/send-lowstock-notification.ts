import { InferTypeOf, ProductVariantDTO } from "@medusajs/framework/types"
import { createStep } from "@medusajs/framework/workflows-sdk"
import LowstockSubscription from "../../../modules/lowstock/models/lowstock-subscription"

type SendLowstockNotificationStepInput = (InferTypeOf<typeof LowstockSubscription> & {
  product_variant?: ProductVariantDTO
})[]

export const sendLowstockNotificationStep = createStep(
  "send-lowstock-notification",
  async (input: SendLowstockNotificationStepInput, { container }) => {
    const notificationModuleService = container.resolve("notification")

    const notificationData = input.map((subscription) => ({
      to:       subscription.email,
      channel:  "email",
      template: "variant-lowstock",
      data:     {
        variant: subscription.product_variant,
      },
    }))

    await notificationModuleService.createNotifications(notificationData)
  }
)