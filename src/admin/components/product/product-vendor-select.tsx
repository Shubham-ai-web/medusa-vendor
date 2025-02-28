import {Button, Drawer, Select, Text} from "@medusajs/ui";
import {useState} from "react";

export function ProductVendorForm({
                                      vendor,
                                      handleSubmit,
                                      loading,
                                      error,
                                      vendorList,
                                  }: {
    vendor?: any;
    handleSubmit: (data: any) => Promise<void>;
    loading: boolean;
    error: Error | null;
    vendorList: any;
}) {
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

    const [formData, setFormData] = useState<any>(vendor || ({} as any));

    const handleVendorSelect = (value: string) => {
        console.log(value);

        setSelectedVendor(value);
        setFormData(() => ({
            product_id: vendor?.product?.id,
            vendor_id:  value,
        }));
    };
    const vendorId = Array.isArray(vendor?.product?.vendor)
        ? vendor?.product?.vendor
        : vendor?.product?.vendor
            ? [vendor?.product?.vendor]
            : [];

    const filteredVendors = vendorList.filter(
        (data: any) =>
            !vendorId.some((assignedVendor: any) => assignedVendor.id === data.id)
    );

    return (
        <form>
            <Drawer.Body className="p-4">
                <div className="flex flex-col gap-2">
                    <Select
                        value={selectedVendor ?? ""}
                        onValueChange={handleVendorSelect}
                    >
                        <Select.Trigger>
                            <Select.Value placeholder="Select vendor"/>
                        </Select.Trigger>
                        <Select.Content>
                            {filteredVendors?.length > 0 ? (
                                filteredVendors?.map((item: any) => (
                                    <Select.Item key={item?.id} value={item?.id}>
                                        {`${item?.first_name} ${item?.last_name} <${item?.email}>`}
                                    </Select.Item>
                                ))
                            ) : (
                                <Select.Item disabled value="No vendors available">
                                    No vendors available
                                </Select.Item>
                            )}
                        </Select.Content>
                    </Select>
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
