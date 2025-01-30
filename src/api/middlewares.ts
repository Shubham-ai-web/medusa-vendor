import {
  defineMiddlewares,
} from "@medusajs/framework/http";
import { adminMiddlewares } from "./admin/middlewares";
import { z } from "zod"

export default defineMiddlewares({
  routes: [
    ...adminMiddlewares,
    {
      matcher: "/admin/products",
      method: ["POST"],
      additionalDataValidator: {
        vendor_id: z.string().optional(),
      },
    },
  ],
});
