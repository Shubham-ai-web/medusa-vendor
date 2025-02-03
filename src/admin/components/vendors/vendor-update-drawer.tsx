import { Drawer, toast } from "@medusajs/ui";
import { useUpdateVendor } from "../../hook/vendor";
import { VendorForm } from "./vendor-form";

export function VendorUpdateDrawer({
  vendor,
  refetch,
  open,
  setOpen,
}: {
  vendor: any;
  refetch: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { mutate, loading, error } = useUpdateVendor(vendor.id);

  const { ...currentData } = vendor;

  const handleSubmit = async (formData: any) => {
    await mutate(formData).then(() => {
      setOpen(false);
      refetch();
      toast.success(`Vendor ${formData.name} updated successfully`);
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Content className="z-50">
        <Drawer.Header>
          <Drawer.Title>Edit Vendor</Drawer.Title>
        </Drawer.Header>

        <VendorForm
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          vendor={currentData}
        />
      </Drawer.Content>
    </Drawer>
  );
}
