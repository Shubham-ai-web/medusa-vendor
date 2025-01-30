import { MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { PostAdminCreateVendor } from "./validators";

export const GetVendorsSchema = createFindParams()

export const adminVendorMiddlewares: MiddlewareRoute[] = [
    /* Vendors Middlewares */
    {
        matcher: "/admin/vendors",
        method: ["POST"],
      middlewares: [
        validateAndTransformBody(PostAdminCreateVendor),
      ],
    },
    {
        matcher: "/admin/vendors",
        method: ["GET"],
      middlewares: [
        validateAndTransformQuery(
          GetVendorsSchema,
          {
            defaults: [
              "id",
              "name",
              "products.*",
            ],
            isList: true,
          }
        ),

      ],
    }
  ];
  