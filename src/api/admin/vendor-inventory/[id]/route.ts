import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { AdminPutVendorInventoryReq } from "../validators";
import { VENDOR_MODULE } from "../../../../modules/vendor";
import VendorModuleService from "../../../../modules/vendor/service";

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const moduleService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE);
    const vendorInventoryService = moduleService.getVendorInventoryService();
    const { id } = req.params;
    const validated = AdminPutVendorInventoryReq.parse(req.body);

    const data = await vendorInventoryService.update(id, validated);

    return res.json(data);
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: "Failed to fetch vendor inventories" });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const moduleService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE);
    const vendorInventoryService = moduleService.getVendorInventoryService();
    const { id } = req.params;
    await vendorInventoryService.delete(id);
    return res.json({ id });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: "Failed to fetch vendor inventories" });
  }

};
