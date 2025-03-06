import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps } from "@medusajs/framework/types";
import { VendorInventoryWidget } from "../../components/vendor-inventory/vendor-inventory-widget";

type Props = {
  id: string;
};

const Widget = ({ data }: DetailWidgetProps<Props>) => {
  return <VendorInventoryWidget inventoryItemId={data.id}/>;
};

export const config = defineWidgetConfig({
  zone: "inventory_item.details.after",
});

export default Widget;
