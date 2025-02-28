import {Drawer} from "@medusajs/ui";
import {useUpdateProductVendor} from "../../hook/product";
import {ProductVendorForm} from "./product-vendor-select";
import {useQuery} from "@tanstack/react-query";
import {VendorsResponse} from "../../routes/vendors/page";
import {sdk} from "../../lib/sdk";

export function VendorProductDrawer({
                                        open,
                                        onClose,
                                        refetch,
                                        vendor,
                                    }: {
    open: boolean;
    onClose: () => void;
    refetch: () => void;
    vendor: any;
}) {
    const {mutate, loading, error} = useUpdateProductVendor();
    const handleSubmit = async (formData: any) => {
        await mutate(formData).then(() => onClose());
        refetch();
    };
    const {data} = useQuery<VendorsResponse>({
        queryFn:  () => sdk.client.fetch(`/admin/vendors`, {}),
        queryKey: [["vendors"]],
    });

    return (
        <Drawer open={open} onOpenChange={onClose}>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Assign Vendor</Drawer.Title>
                </Drawer.Header>
                <ProductVendorForm
                    handleSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    vendor={vendor}
                    vendorList={data?.vendors}
                />
            </Drawer.Content>
        </Drawer>
    );
}
