import { defineRouteConfig } from "@medusajs/admin-sdk";
import { BuildingsSolid } from "@medusajs/icons";
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
import { VendorCreateDrawer } from "../../components/vendors/vendor-create-drawer";
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
  const [pagination, _setPagination] = useState<DataTablePaginationState>({
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
    <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
      <div className="flex justify-between px-6 py-4">
        <Heading>Vendors</Heading>
        <VendorCreateDrawer refetch={refetch} />
      </div>
      {data?.vendors && data?.vendors.length > 0 && (
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
              <Table.Row className="rounded-lg" key={vendor.id}>
                <Table.Cell>{vendor.id}</Table.Cell>
                <Table.Cell>
                  {vendor.first_name} {vendor.last_name}
                </Table.Cell>
                <Table.Cell>{vendor.email}</Table.Cell>
                <Table.Cell>{vendor.phone}</Table.Cell>
                <Table.Cell>{vendor.address}</Table.Cell>
                <Table.Cell onClick={(e) => e.stopPropagation()}>
                  <VendorActionsMenu vendor={vendor} refetch={refetch} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      {(!data?.vendors || data?.vendors.length == 0) && (
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-y-4">
          <div className="flex flex-col items-center gap-y-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              fill="none"
              className="text-ui-fg-subtle"
            >
              <g stroke="currentColor" clipPath="url(#a)">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7.5 13.944a6.444 6.444 0 1 0 0-12.888 6.444 6.444 0 0 0 0 12.888M7.5 4.328v3.678"
                ></path>
                <path
                  strokeWidth="0.9"
                  d="M7.5 10.976a.44.44 0 0 1 0-.878.44.44 0 0 1 0 .878Z"
                ></path>
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h15v15H0z"></path>
                </clipPath>
              </defs>
            </svg>
            <div className="flex flex-col items-center gap-y-1">
              <p className="font-medium font-sans txt-compact-small">
                No records
              </p>
              <p className="font-normal font-sans txt-small text-ui-fg-muted">
                There are no records to show
              </p>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Vendors",
  icon: BuildingsSolid,
});

export default VendorsPage;
