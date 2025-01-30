import { MiddlewareRoute } from "@medusajs/framework";
import { adminVendorMiddlewares } from "./vendors/middlewares";

export const adminMiddlewares: MiddlewareRoute[] = [
    ...adminVendorMiddlewares,
  ];
  