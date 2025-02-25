import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import LowstockModule from "../modules/lowstock"

export default defineLink(
  {
    ...LowstockModule.linkable.lowstockSubscription.id,
    field: "variant_id",
  },
  ProductModule.linkable.productVariant,
  {
    readOnly: true,
  }
)