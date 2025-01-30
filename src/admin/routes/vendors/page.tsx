import { defineRouteConfig } from "@medusajs/admin-sdk";
import { TagSolid } from "@medusajs/icons";
import {
  Container,
  DataTable,
  Heading,
  createDataTableColumnHelper,
  DataTablePaginationState,
  useDataTable,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { useMemo, useState } from "react";
import { VendorCreateDrawer } from "../../components/vendors/create-vendor-drawer";

type Vendor = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
};
type VendorsResponse = {
  vendors: Vendor[];
  count: number;
  limit: number;
  offset: number;
};

const VendorsPage = () => {
  // TODO retrieve brands
  const columnHelper = createDataTableColumnHelper<Vendor>();

  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("first_name", {
      header: "First Name",
    }),
    columnHelper.accessor("last_name", {
      header: "Last Name",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
    }),
    columnHelper.accessor("address", {
      header: "Address",
    }),
  ];

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
  console.log(data, "data");

  const table = useDataTable({
    columns,
    data: data?.vendors || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  });

  return (
    <Container className="divide-y p-0">
      {/* TODO show vendors */}
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Heading>Vendors</Heading>
          <VendorCreateDrawer refetch={refetch} />
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "vendors",
  icon: TagSolid,
});

export default VendorsPage;
