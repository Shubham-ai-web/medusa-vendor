import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { clx, Container, Text } from "@medusajs/ui";
import { Pencil } from "@medusajs/icons";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { Header } from "../components/header";

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
  const { data: queryResult } = useQuery({
    queryFn: () =>
      sdk.admin.product.retrieve(product.id, {
        fields: "+vendor.*",
      }),
    queryKey: [["product", product.id]],
  });
  const vendorEmail =
    (queryResult?.product as AdminProductBrand)?.vendor?.email || "-";

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
                      onClick: () => {
                        alert("You clicked the edit action!");
                      },
                    },
                  ],
                },
              ],
            },
          },
        ]}
      />
      <div
        className={clx(
          `text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4`
        )}
      >
        <Text size="small" weight="plus" leading="compact">
          Email
        </Text>

        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {vendorEmail}
        </Text>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.before",
});

export default ProductBrandWidget;
