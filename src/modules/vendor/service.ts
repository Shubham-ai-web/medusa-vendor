import { MedusaService } from "@medusajs/framework/utils";
import { Vendor } from "./models/vendor";
import { VendorInventory } from "./models/vendor-inventory";
import VendorInventoryService from "./services/vendor-inventory";

type InjectedDependencies = {
  vendorInventoryService: VendorInventoryService
}

class VendorModuleService extends MedusaService({
  Vendor,
  VendorInventory,
}) {
  protected readonly vendorInventoryService: VendorInventoryService

  constructor({ vendorInventoryService }: InjectedDependencies) {
    super(...arguments);
    this.vendorInventoryService = vendorInventoryService;
  }

  getVendorInventoryService(): VendorInventoryService {
    return this.vendorInventoryService;
  }
}

export default VendorModuleService;
