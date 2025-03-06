import {
  authenticate,
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { adminMiddlewares } from "./admin/middlewares";
import { z } from "zod"
import { PostStoreCreateLowstockSubscription } from "./store/lowstock-subscriptions/validators";

export default defineMiddlewares({
  routes: [
    ...adminMiddlewares,
    {
      matcher:     "/store/lowstock-subscriptions",
      method:      "POST",
      middlewares: [
        authenticate("customer", [ "bearer", "session" ], {
          allowUnauthenticated: true,
        }),
        validateAndTransformBody(PostStoreCreateLowstockSubscription),
      ],

    }
  ],
});
