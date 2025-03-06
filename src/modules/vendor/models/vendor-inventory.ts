import { model } from "@medusajs/framework/utils";
import { Vendor } from "./vendor";

export const VendorInventory = model.define("vendor_inventory", {
  id:                model.id({ prefix: 'vitem' }).primaryKey(),
  vendor:            model.belongsTo(() => Vendor, { fieldName: "vendor_id", unique: [ "inventory_item_id" ] }),
  inventory_item_id: model.text(),
  price:             model.number(),
  turnaround_days:   model.number(),
  is_preferred:      model.boolean().default(false),
}); 