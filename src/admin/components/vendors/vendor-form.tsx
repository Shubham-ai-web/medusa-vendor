import { Button, Drawer, Input, Label, Text } from "@medusajs/ui";
import { useState } from "react";

export function VendorForm({
  vendor,
  handleSubmit,
  loading,
  error,
}: {
  vendor?: any;
  handleSubmit: (data: any) => Promise<void>;
  loading: boolean;
  error: Error | null;
}) {
  const [formData, setFormData] = useState<any>(vendor || ({} as any));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <form>
      <Drawer.Body className="p-4">
        <div className="flex flex-col gap-2">
          <Label size="xsmall">First Name</Label>
          <Input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Medusa"
          />
          <Label size="xsmall">Last Name</Label>
          <Input
            type="text"
            name="last_name"
            value={formData.last_name || ""}
            onChange={handleChange}
            placeholder="js"
          />
          <Label size="xsmall">Phone</Label>
          <Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="1234567890"
          />
          <Label size="xsmall">Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="medusa@medusa.com"
          />
          <Label size="xsmall">Address</Label>
          <Input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="1234 Main St"
          />
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="secondary">Cancel</Button>
        </Drawer.Close>
        <Button
          isLoading={loading}
          onClick={async () => await handleSubmit(formData)}
        >
          Save
        </Button>
        {error && (
          <Text className="txt-compact-small text-ui-fg-warning">
            Error: {error?.message}
          </Text>
        )}
      </Drawer.Footer>
    </form>
  );
}
