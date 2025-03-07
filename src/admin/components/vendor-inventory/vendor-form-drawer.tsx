import { Drawer } from "@medusajs/ui";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorInventoryForm } from "./vendor-inventory-form.tsx";
import { CreateUpdateVendorInventoryDTO, VendorInventory } from "./types";
import { useEffect } from "react";

const schema = zod.object({
  vendor:          zod.string().min(1, "Vendor is required").optional(),
  price:           zod.number().min(0, "Price must be non-negative"),
  turnaround_days: zod.number().min(1, "Turnaround days must be at least 1"),
  is_preferred:    zod.boolean(),
  inventory_sku:   zod.string().min(1, "Inventory SKU is required").optional(),
});

interface VendorFormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingItem: VendorInventory | null;
  inventoryItemId: string;
  availableVendors: { id: string; company_name: string; email: string }[];
  onSubmit: (data: CreateUpdateVendorInventoryDTO) => void;
  loading: boolean;
  error: Error | null;
}

export const VendorFormDrawer = ({
                                   open,
                                   onOpenChange,
                                   editingItem,
                                   inventoryItemId,
                                   availableVendors,
                                   onSubmit,
                                   loading,
                                   error,
                                 }: VendorFormDrawerProps) => {
  const initialFormValues = {
    vendor:          "",
    price:           0,
    turnaround_days: 0,
    is_preferred:    false,
    inventory_sku:   "",
  };

  const { handleSubmit, register, control, reset, formState: { errors } } = useForm({
    defaultValues: initialFormValues,
    resolver:      zodResolver(schema),
  });

  useEffect(() => {
    if (editingItem && open) {
      reset({
        price:           editingItem.price || 0,
        turnaround_days: editingItem.turnaround_days || 0,
        is_preferred:    editingItem.is_preferred,
        vendor:          editingItem.vendor.id,
        inventory_sku:   editingItem.inventory_sku || "",
      });
    } else if (!editingItem && open) {
      reset(initialFormValues);
    }
  }, [ editingItem, open, reset ]);

  const handleFormSubmit = (formData: typeof initialFormValues) => {
    console.log("formData", formData);

    const data: CreateUpdateVendorInventoryDTO = {
      inventory_item_id: inventoryItemId,
      price:             formData.price ?? 0,
      turnaround_days:   formData.turnaround_days ?? 0,
      is_preferred:      formData.is_preferred,
      inventory_sku:     formData.inventory_sku ?? "",
      ...(formData.vendor && { vendor: formData.vendor }),
    };
    onSubmit(data);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>
            {editingItem ? "Edit Vendor Relationship" : "Add Vendor Relationship"}
          </Drawer.Title>
        </Drawer.Header>
        <form className="flex flex-1 flex-col overflow-hidden" onSubmit={handleSubmit(handleFormSubmit)}>
          <VendorInventoryForm
            register={register}
            loading={loading}
            error={error}
            errors={errors}
            control={control}
            vendors={availableVendors}
            isEditing={!!editingItem}
          />
        </form>
      </Drawer.Content>
    </Drawer>
  );
};