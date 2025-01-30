import { Button, Drawer } from "@medusajs/ui";
import { useState } from "react";
import { useCreateVendor } from "../../hook/vendor";
import { VendorForm } from "./vendor-form";
// import { useCreateCompany } from "../../hooks";
// import { CompanyForm } from "./company-form";

export function VendorCreateDrawer({ refetch }: { refetch: () => void }) {
  const [open, setOpen] = useState(false);

  const { mutate, loading, error } = useCreateVendor();

  const handleSubmit = async (formData: any) => {
    await mutate(formData).then(() => setOpen(false));
    refetch();
  };

  return (

    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button variant="secondary" size="small">
          Create
        </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Create Company</Drawer.Title>
        </Drawer.Header>
        <VendorForm
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </Drawer.Content>
    </Drawer>
  );
}
