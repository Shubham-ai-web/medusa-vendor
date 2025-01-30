import { model } from "@medusajs/framework/utils";

export const Vendor = model.define("vendor", {
    id: model.id().primaryKey(),
    first_name: model.text(),
    last_name: model.text(),
    email: model.text(),
    phone: model.text(),
    address: model.text(), 
});