import { defineRouteConfig } from "@medusajs/admin-sdk";
import { TagSolid } from "@medusajs/icons";
import {
  Container,
  Heading,
  DataTablePaginationState,
  Table,
  Text,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { useMemo, useState } from "react";
import { VendorCreateDrawer } from "../../components/vendors/create-vendor-drawer";
import { VendorActionsMenu } from "../../components/vendors/vendor-actions-drawer";

type Vendor = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
};
export type VendorsResponse = {
  vendors: Vendor[];
  count: number;
  limit: number;
  offset: number;
};

const VendorsPage = () => {
  const limit = 15;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading, refetch } = useQuery<VendorsResponse>({
    queryFn: () =>
      sdk.client.fetch(`/admin/vendors`, {
        query: {
          limit,
          offset,
        },
      }),
    queryKey: [["vendors", limit, offset]],
  });

  return (
    <Container className="flex flex-col p-0 overflow-hidden">
      <div className="p-6 flex justify-between">
        <Heading>Vendors</Heading>
        <VendorCreateDrawer refetch={refetch} />
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Phone</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading && <Text className="text-center">Loading...</Text>}
          {data?.vendors.map((vendor) => (
            <Table.Row key={vendor.id}>
              <Table.Cell>{vendor.id}</Table.Cell>
              <Table.Cell>
                {vendor.first_name} {vendor.last_name}
              </Table.Cell>
              <Table.Cell>{vendor.email}</Table.Cell>
              <Table.Cell>{vendor.phone}</Table.Cell>
              <Table.Cell>{vendor.address}</Table.Cell>
              <Table.Cell onClick={(e) => e.stopPropagation()}>
                    <VendorActionsMenu
                      vendor={vendor}
                      refetch={refetch}
                    />
                  </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "vendors",
  icon: TagSolid,
});

export default VendorsPage;
