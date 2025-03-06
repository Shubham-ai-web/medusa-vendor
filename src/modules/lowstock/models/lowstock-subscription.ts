import { model } from "@medusajs/framework/utils"

const LowstockSubscription = model.define("lowstock_subscription", {
  id:               model.id().primaryKey(),
  variant_id:       model.text(),
  sales_channel_id: model.text(),
  email:            model.text(),
  user_id:          model.text().nullable(),
})
  .indexes([
    {
      on:     [ "variant_id", "sales_channel_id", "email" ],
      unique: true,
    },
  ])

export default LowstockSubscription