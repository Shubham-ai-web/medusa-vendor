import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { Container, Table } from "@medusajs/ui";
import { Pencil } from "@medusajs/icons";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { Header } from "../components/header";
import { VendorProductDrawer } from "../components/vendors/product-vendor-drawer";
import { useState } from "react";

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
  const { data: queryResult, refetch } = useQuery({
    queryFn: () =>
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
        title="Vendor"
        actions={[
          {
            type: "action-menu",
            props: {
              groups: [
                {
                  actions: [
                    {
                      icon: <Pencil />,
                      label: "Edit",
                      onClick: () => setIsDrawerOpen(true),
                    },
                  ],
                },
              ],
            },
          },
        ]}
      />
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {vendors.length > 0 ? (
            vendors.map((vendor: any) => (
              <Table.Row key={vendor.id}>
                <Table.Cell>{vendor.email}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell>No vendors assigned</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
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
