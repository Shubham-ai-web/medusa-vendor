import { MiddlewareRoute } from "@medusajs/framework";
import { adminVendorMiddlewares } from "./vendors/middlewares";
import { adminVendorInventoryMiddlewares } from "./vendor-inventory/middlewares";

export const adminMiddlewares: MiddlewareRoute[] = [
  ...adminVendorMiddlewares,
  ...adminVendorInventoryMiddlewares,
];
  