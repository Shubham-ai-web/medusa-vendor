import { model } from "@medusajs/framework/utils";

export const Vendor = model.define("vendor", {
    id: model.id().primaryKey(),
    first_name: model.text(),
    last_name: model.text(),
    email: model.text(),
    phone: model.text(),
    address: model.text(),
    address2: model.text().nullable(),
    company_name: model.text().nullable(),
    tax_id: model.text().nullable(),
    city: model.text().nullable(),
    state: model.text().nullable(),
    country: model.text().nullable(),
    postal_code: model.text().nullable(),
});