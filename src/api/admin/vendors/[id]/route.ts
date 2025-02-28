import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateVendorWorkflow } from "../../../../workflows/vendor/update-vendor";
import { PostAdminUpdateVendorType } from "../validators";

export const POST = async (
  req: AuthenticatedMedusaRequest<PostAdminUpdateVendorType>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { id } = req.params;

  await updateVendorWorkflow.run({ input: { ...req.body, id } });

  const {
    data: [vendor],
  } = await query.graph(
    {
      entity: "vendor",
      ...req.queryConfig,
      filters: { id },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ vendor });
};
