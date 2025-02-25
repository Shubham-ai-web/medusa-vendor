import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { validateVariantOutOfStockStep } from "./steps/validate-variant-out-of-stock"
import { createLowstockSubscriptionStep } from "./steps/create-lowstock-subscription"
import { updateLowstockSubscriptionStep } from "./steps/update-lowstock-subscription"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

type CreateLowstockSubscriptionWorkflowInput = {
    variant_id: string
    sales_channel_id: string
    user: {
      email?: string
      user_id?: string
    }
  }
  
  export const createLowstockSubscriptionWorkflow = createWorkflow(
    "create-lowstock-subscription",
    ({
      variant_id,
      sales_channel_id,
      user,
    }: CreateLowstockSubscriptionWorkflowInput) => {
      const userId = transform({
        user,
      }, (data) => {
        return data.user.user_id || ""
      })
      const retrievedUser = when(
        "retrieve-user-by-id",
        { user }, 
        ({ user }) => {
          return !user.email
        }
      ).then(() => {
        // @ts-ignore
        const { data } = useQueryGraphStep({
          entity: "user",
          fields: ["email"],
          filters: { id: userId },
          options: {
            throwIfKeyNotFound: true,
          },
        }).config({ name: "retrieve-user" })
  
        return data
      })
      
      const email = transform({ 
        retrievedUser, 
        user,
      }, (data) => {
        return data.user?.email ?? data.retrievedUser?.[0].email
      })
      
      // TODO add more steps
      validateVariantOutOfStockStep({
        variant_id,
        sales_channel_id,
      })
      
      // @ts-ignore
      const { data: lowstockSubscriptions } = useQueryGraphStep({
        entity: "lowstock_subscription",
        fields: ["*"],
        filters: {
          email,
          variant_id,
          sales_channel_id,
        },
      }).config({ name: "retrieve-subscriptions" })
      
      when({ lowstockSubscriptions }, ({ lowstockSubscriptions }) => {
        return lowstockSubscriptions.length === 0
      })
      .then(() => {
        createLowstockSubscriptionStep({
          variant_id,
          sales_channel_id,
          email,
          user_id: user.user_id,
        })
      })
      
      when({ lowstockSubscriptions }, ({ lowstockSubscriptions }) => {
        return lowstockSubscriptions.length > 0
      })
      .then(() => {
        updateLowstockSubscriptionStep({
          id: lowstockSubscriptions[0].id,
          user_id: user.user_id,
        })
      })
      
      // @ts-ignore
      const { data: lowstockSubscription } = useQueryGraphStep({
        entity: "lowstock_subscription",
        fields: ["*"],
        filters: {
          email,
          variant_id,
          sales_channel_id,
        },
      }).config({ name: "retrieve-lowstock-subscription" })
      
      return new WorkflowResponse(
        lowstockSubscription
      )
    }
  )