export type VendorInventory = {
  id: string;
  inventory_item_id: string;
  price: number | null;
  turnaround_days: number | null;
  is_preferred: boolean;
  vendor: {
    id: string;
    first_name: string;
    last_name: string;
    company_name: string;
    email: string;
    phone: string;
    address: string;
  };
};

export type VendorInventoryResponse = {
  vendor_inventories: VendorInventory[];
  count: number;
  limit: number;
  offset: number;
};

export type CreateUpdateVendorInventoryDTO = {
  vendor?: string;
  inventory_item_id: string;
  price: number;
  turnaround_days: number;
  is_preferred: boolean;
};