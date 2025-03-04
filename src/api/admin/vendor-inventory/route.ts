import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AdminPostVendorInventoryReq } from "./validators"
import { VENDOR_MODULE } from "../../../modules/vendor"
import VendorModuleService from "../../../modules/vendor/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const moduleService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE);
    const vendorInventoryService = moduleService.getVendorInventoryService();
    const { inventory_item_id, limit, offset } = req.query;

    const [vendor_inventories, count] = await vendorInventoryService.listAndCount(
      { inventory_item_id },
      {
        limit:  parseInt(limit as string),
        offset: parseInt(offset as string),
      }
    );

    return res.json({
      vendor_inventories,
      count,
      limit:  parseInt(limit as string),
      offset: parseInt(offset as string)
    })
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: "Failed to fetch vendor inventories" });
  }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const moduleService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE)
  const vendorInventoryService = moduleService.getVendorInventoryService()
  const validated = AdminPostVendorInventoryReq.parse(req.body)
  const data = await vendorInventoryService.create(validated)
  return res.json(data)
} 