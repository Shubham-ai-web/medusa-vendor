import { Drawer } from "@medusajs/ui";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorInventoryForm } from "../../components/vendor-inventory/vendor-inventory-form.tsx";
import { CreateUpdateVendorInventoryDTO, VendorInventory } from "./types";
import { useEffect } from "react";

const schema = zod.object({
  vendor: zod.string().min(1, "Vendor is required").optional(),
  price: zod.number().min(0, "Price must be non-negative"),
  turnaround_days: zod.number().min(1, "Turnaround days must be at least 1"),
  is_preferred: zod.boolean(),
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
    vendor: "",
    price: null as number | null,
    turnaround_days: null as number | null,
    is_preferred: false,
  };

  const { handleSubmit, register, control, reset, formState: { errors } } = useForm({
    defaultValues: initialFormValues,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (editingItem && open) {
      console.log("Resetting form with editingItem:", editingItem);
      reset({
        price: editingItem.price,
        turnaround_days: editingItem.turnaround_days,
        is_preferred: editingItem.is_preferred,
        vendor: editingItem.vendor.id,
      });
    } else if (!editingItem && open) {
      console.log("Resetting form to initial values");
      reset(initialFormValues);
    }
  }, [editingItem, open, reset]);

  const handleFormSubmit = (formData: typeof initialFormValues) => {
    const data: CreateUpdateVendorInventoryDTO = {
      inventory_item_id: inventoryItemId,
      price: formData.price ?? 0,
      turnaround_days: formData.turnaround_days ?? 1,
      is_preferred: formData.is_preferred,
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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
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