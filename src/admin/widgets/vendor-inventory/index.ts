import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { VendorInventoryWidget } from "./VendorInventoryWidget"

export const config = defineWidgetConfig({
  zone: "inventory_item.details.after",
})

export default VendorInventoryWidget