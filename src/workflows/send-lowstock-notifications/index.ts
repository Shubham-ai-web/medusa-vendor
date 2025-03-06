import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { getDistinctSubscriptionsStep } from "./steps/get-distinct-subscriptions"
import { getLowstockedStep } from "./steps/get-lowstocked"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { sendLowstockNotificationStep } from "./steps/send-lowstock-notification"
import { deleteLowstockSubscriptionStep } from "./steps/delete-lowstock-subscriptions"

export const sendLowstockNotificationsWorkflow = createWorkflow(
  "send-lowstock-notifications",
  () => {
    const subscriptions = getDistinctSubscriptionsStep()

    // @ts-ignore
    const lowstockedSubscriptions = getLowstockedStep(subscriptions)

    const { variant_ids, sales_channel_ids } = transform({
      lowstockedSubscriptions,
    }, (data) => {
      const filters: Record<string, string[]> = {
        variant_ids:       [],
        sales_channel_ids: [],
      }
      data.lowstockedSubscriptions.map((subscription) => {
        filters.variant_ids.push(subscription.variant_id)
        filters.sales_channel_ids.push(subscription.sales_channel_id)
      })

      return filters
    })

    // @ts-ignore
    const { data: lowstockedSubscriptionsWithEmails } = useQueryGraphStep({
      entity:  "lowstock_subscription",
      fields:  [ "*", "product_variant.*" ],
      filters: {
        variant_id:       variant_ids,
        sales_channel_id: sales_channel_ids,
      },
    })

    // @ts-ignore
    sendLowstockNotificationStep(lowstockedSubscriptionsWithEmails)

    // @ts-ignore
    deleteLowstockSubscriptionStep(lowstockedSubscriptionsWithEmails)

    return new WorkflowResponse({
      subscriptions: lowstockedSubscriptionsWithEmails,
    })
  }
)