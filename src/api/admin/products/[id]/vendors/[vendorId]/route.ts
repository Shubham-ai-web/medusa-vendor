import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { VENDOR_MODULE } from "../../../../../../modules/vendor";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const link = req.scope.resolve(ContainerRegistrationKeys.LINK);
    const productId = req.params.id;
    const vendorId = req.params.vendorId;

    let data = await link.dismiss({
      [Modules.PRODUCT]: {
        product_id: productId,
      },
      [VENDOR_MODULE]:   {
        vendor_id: vendorId,
      },
    });

    res.json({ success: true, message: "Vendor removed from product successfully" });
  } catch (error) {
    console.error("Error removing vendor from product:", error);
    res.status(500).json({ error: "Failed to remove vendor from product" });
  }
};