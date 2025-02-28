import {defineWidgetConfig} from "@medusajs/admin-sdk";
import {DetailWidgetProps, AdminProduct} from "@medusajs/framework/types";
import {Button, Container} from "@medusajs/ui";
import {Trash} from "@medusajs/icons";
import {Pencil} from "@medusajs/icons";
import {useQuery} from "@tanstack/react-query";
import {sdk} from "../lib/sdk";
import {Header} from "../components/header";
import {VendorProductDrawer} from "../components/product/product-vendor-drawer";
import {useState} from "react";

type AdminProductBrand = AdminProduct & {
    vendor?: {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        address: string;
    };
};

const ProductBrandWidget = ({
                                data: product,
                            }: DetailWidgetProps<AdminProduct>) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const {data: queryResult, refetch} = useQuery({
        queryFn:  () =>
                      sdk.admin.product.retrieve(product.id, {
                          fields: "+vendor.*",
                      }),
        queryKey: [["product", product.id]],
    });

    const vendorData = (queryResult?.product as AdminProductBrand)?.vendor;
    const vendors = Array.isArray(vendorData)
        ? vendorData
        : vendorData
            ? [vendorData]
            : [];

    return (
        <Container className="divide-y p-0">
            <Header
                title="Vendors"
                actions={[
                    {
                        type:  "action-menu",
                        props: {
                            groups: [
                                {
                                    actions: [
                                        {
                                            icon:    <Pencil/>,
                                            label:   "Assign",
                                            onClick: () => setIsDrawerOpen(true),
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ]}
            />
            <ul className="divide-y">
                {vendors.length > 0 ? (
                    vendors.map((vendor: any) => (
                        <li className="rounded-lg flex flex-row justify-between p-4 text-body-color dark:text-dark-6 flex text-sm bg-ui-bg-base hover:bg-ui-bg-base-hover">
                            <span>{`${vendor.first_name} ${vendor.last_name} <${vendor.email}>`}</span>
                            <Button variant="danger" size="small" title="Unlink Vendor"><Trash /></Button>
                        </li>
                    ))
                ) : (
                    <li>No vendors assigned</li>
                )}
            </ul>
            <VendorProductDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                refetch={refetch}
                vendor={queryResult}
            />
        </Container>
    );
};

export const config = defineWidgetConfig({
    zone: "product.details.side.before",
});

export default ProductBrandWidget;
