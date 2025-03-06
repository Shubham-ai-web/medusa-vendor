import { MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";
import { AdminGetVendorInventoryReq, AdminPostVendorInventoryReq, AdminPutVendorInventoryReq } from "./validators";

export const adminVendorInventoryMiddlewares: MiddlewareRoute[] = [
  {
    matcher:     "/admin/vendor-inventory",
    method:      [ "GET" ],
    middlewares: [
      validateAndTransformQuery(
        AdminGetVendorInventoryReq,
        {
          defaults: [
            "id",
            "inventory_item_id",
            "price",
            "turnaround_days",
            "is_preferred",
            "vendor.*",
          ],
          isList:   true,
        }
      ),
    ],
  },
  {
    matcher:     "/admin/vendor-inventory/:id",
    method:      [ "PUT" ],
    middlewares: [
      validateAndTransformBody(AdminPutVendorInventoryReq)
    ],
  },
  {
    matcher:     "/admin/vendor-inventory/:id",
    method:      [ "DELETE" ],
    middlewares: [],
  },
  {
    matcher:     "/admin/vendor-inventory/selection",
    method:      [ "GET" ],
    middlewares: [],
  },
  {
    matcher:     "/admin/vendor-inventory",
    method:      [ "POST" ],
    middlewares: [
      validateAndTransformBody(AdminPostVendorInventoryReq)
    ],
  },
];
  