import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import VendorModuleService from "../../../../modules/vendor/service";
import { VENDOR_MODULE } from "../../../../modules/vendor";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve("query");
    let { inventory_item_id } = req.query;

    const moduleService = req.scope.resolve<VendorModuleService>(VENDOR_MODULE);
    const vendorInventoryService = moduleService.getVendorInventoryService();

    if (req.queryConfig?.pagination?.order) {
      req.queryConfig.pagination.order = Object.keys(req.queryConfig?.pagination?.order)
        .map(order => order.split(':'))
        .reduce((obj, item) => Object.assign(obj, { [item[0]]: item[1] }), {});
    }

    const [ vendor_inventories ] = await vendorInventoryService.listAndCount(
      { inventory_item_id },
      {
        ...req.queryConfig?.pagination?.order && { orderBy: req.queryConfig?.pagination?.order }
      }
    );


    const { data: vendors } = await query.graph({
      entity:  "vendor",
      fields:  [ "*" ],
      filters: {
        id: {
          $nin: vendor_inventories.map(vi => vi.vendor_id),
        }
      }
    });
    res.json({ vendors });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
};