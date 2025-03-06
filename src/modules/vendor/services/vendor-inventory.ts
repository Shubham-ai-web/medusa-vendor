import { EntityManager } from "@mikro-orm/core";
import { VendorInventory } from "../models/vendor-inventory";
import { DAL } from "@medusajs/framework/types";
import { MedusaService } from "@medusajs/framework/utils";
import { Vendor } from "../models/vendor";

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
}

class VendorInventoryService extends MedusaService({
  VendorInventory
}) {
  protected baseRepository_: DAL.RepositoryService

  constructor({ baseRepository }: InjectedDependencies) {
    super(...arguments)
    this.baseRepository_ = baseRepository
  }

  async listAndCount(selector: Record<string, unknown>, config: Record<string, unknown> = {}) {
    return await this.baseRepository_.transaction(async (manager: EntityManager) => {
      return await manager.findAndCount(VendorInventory, selector, {
        ...config,
        populate: [ "vendor" ]
      });
    });
  }

  async retrieve(id: string) {
    return await this.baseRepository_.transaction(async (manager: EntityManager) => {
      const item = await manager.findOne(VendorInventory, { id }, {});
      if (!item) {
        throw new Error(`Vendor inventory with id ${id} not found`);
      }
      return item;
    });
  }

  async create(data: {
    vendor?: string;
    inventory_item_id: string;
    price: number;
    turnaround_days: number;
    is_preferred?: boolean;
  }) {
    return await this.baseRepository_.transaction(async (manager: EntityManager) => {
      // Check if relationship already exists
      const existing = await manager.findOne(VendorInventory, {
        inventory_item_id: data.inventory_item_id,
        vendor:            data.vendor,
      });

      if (existing) {
        throw new Error(`Vendor relationship already exists for this inventory item`);
      }

      const vendor = await manager.findOne(Vendor, { id: data.vendor });
      if (!vendor) {
        throw new Error(`Vendor with id ${data.vendor} not found`);
      }

      const item = manager.create(VendorInventory, data);
      await manager.persistAndFlush(item);
      return item;
    });
  }

  async update(id: string, data: {
    price?: number;
    turnaround_days?: number;
    is_preferred?: boolean;
    inventory_item_id?: string;
    vendor?: null | string;
  }) {
    delete data.vendor;
    delete data.inventory_item_id;

    return await this.baseRepository_.transaction(async (manager: EntityManager) => {
      const item = await this.retrieve(id);
      manager.assign(item, data);
      await manager.persistAndFlush(item);
      return await manager.findOne(VendorInventory, { id }, {});
    });
  }

  async delete(id: string) {
    return await this.baseRepository_.transaction(async (manager: EntityManager) => {
      const item = await this.retrieve(id);
      await manager.removeAndFlush(item);
      return true;
    });
  }

  async listByInventoryItem(inventoryItemId: string, config: Record<string, unknown> = {}) {
    return await this.listAndCount({ inventory_item_id: inventoryItemId }, {
      ...config,
      populate: [ "vendor" ]
    });
  }

  async listByVendor(vendorId: string, config: Record<string, unknown> = {}) {
    return await this.listAndCount({ vendor: vendorId }, {
      ...config,
      populate: [ "vendor" ]
    });
  }
}

export default VendorInventoryService; 