import {
  Container,
  DataTable,
  Heading,
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  useDataTable,
  type DataTablePaginationState,
  type DataTableSortingState,
  type DataTableRowSelectionState,
} from "@medusajs/ui";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { BuildingsSolid, PencilSquare, Trash } from "@medusajs/icons";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { useMemo, useState } from "react";
import { VendorCreateDrawer } from "../../components/vendors/vendor-create-drawer";
import { ActionMenu } from "../../components/common/actions-menu";
import { VendorUpdateDrawer } from "../../components/vendors/vendor-update-drawer";
import { DeletePrompt } from "../../components/common/delete-prompt";
import { useDeleteVendor } from "../../hooks/vendor";
import { toast } from "@medusajs/ui";
import { Outlet } from "react-router-dom";
import { useCountries } from "../../hooks/countries.tsx";

type Vendor = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  company_name?: string;
  tax_id?: string;
};

export type VendorsResponse = {
  vendors: Vendor[];
  count: number;
  limit: number;
  offset: number;
};

const columnHelper = createDataTableColumnHelper<Vendor>();
const commandHelper = createDataTableCommandHelper();

const useCommands = (
  mutateDelete: (id: string) => Promise<void>,
  refetch: () => void,
  setRowSelection: (selection: DataTableRowSelectionState) => void
) => {
  return [
    commandHelper.command({
      label:    "Delete",
      shortcut: "D",
      action:   async (selection: Record<string, boolean>) => {
        const vendorsToDeleteIds = Object.keys(selection);
        if (vendorsToDeleteIds.length === 0) {
          toast.error("No vendors selected for deletion");
          return;
        }

        try {
          await Promise.all(vendorsToDeleteIds.map((id) => mutateDelete(id)));
          refetch();
          setRowSelection({});
          toast.success(
            `${vendorsToDeleteIds.length} vendor(s) deleted successfully`
          );
        } catch (error) {
          toast.error("Failed to delete vendors");
          console.error("Bulk delete error:", error);
        }
      },
    }),
  ];
};

const columns = [
  columnHelper.select(),
  columnHelper.accessor("company_name", {
    header:        "Company Name",
    enableSorting: true,
  }),
  columnHelper.accessor("first_name", {
    header:        "First Name",
    enableSorting: true,
  }),
  columnHelper.accessor("last_name", {
    header:        "Last Name",
    enableSorting: true,
  }),
  columnHelper.accessor("email", { header: "Email", enableSorting: true }),
  columnHelper.accessor("phone", { header: "Phone", enableSorting: false }),
  columnHelper.display({
    header: "Address",
    cell:   ({ row }) => {
      return [
        row.original.address?.trim(),
        row.original.address2?.trim(),
        row.original.city?.trim(),
        row.original.state?.trim(),
      ]
        .filter((v) => !!v)
        .join(", ");
    },
  }),
  // columnHelper.accessor("city", {header: "City", enableSorting: true}),
  columnHelper.accessor("postal_code", { header: "Postal code" }),
  // columnHelper.accessor("state", {header: "State/Province"}),
];

const getCountryColumn = (
  {
    countries,
    countriesLoading
  }: {
    countries: any | null;
    countriesLoading: boolean;
  }
) => columnHelper.accessor("country", {
  header:        "Country",
  enableSorting: true,
  cell:          ({ row }) => {
    return countriesLoading ? row.original.country : (countries?.find((country: {
      iso_2: string;
      display_name: string;
    }) => country.iso_2 === row.original.country)?.display_name || row.original.country.toUpperCase());
  }
});

const getActionColumn = (
  setSelectedVendor: (vendor: Vendor | null) => void,
  setEditOpen: (open: boolean) => void,
  setDeleteOpen: (open: boolean) => void
) =>
  columnHelper.action({
    // @ts-ignore
    header: "Actions",
    // @ts-ignore
    cell: ({ row }) => (
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon:    <PencilSquare/>,
                label:   "Edit",
                onClick: () => {
                  setSelectedVendor(row.original);
                  setEditOpen(true);
                },
              },
              {
                icon:    <Trash/>,
                label:   "Delete",
                onClick: () => {
                  setSelectedVendor(row.original);
                  setDeleteOpen(true);
                },
              },
            ],
          },
        ]}
      />
    ),
  });

const PAGE_LIMIT = 10;

const VendorsPage = () => {
  const [ pagination, setPagination ] = useState<DataTablePaginationState>({
    pageSize:  PAGE_LIMIT,
    pageIndex: 0,
  });
  const [ sorting, setSorting ] = useState<DataTableSortingState | null>(null);
  const offset = useMemo(() => {
    return pagination.pageIndex * PAGE_LIMIT;
  }, [ pagination ]);

  const [ rowSelection, setRowSelection ] = useState<DataTableRowSelectionState>({});

  const [ editOpen, setEditOpen ] = useState(false);
  const [ deleteOpen, setDeleteOpen ] = useState(false);
  const [ selectedVendor, setSelectedVendor ] = useState<Vendor | null>(null);

  const { mutate: mutateDelete, loading: loadingDelete } = useDeleteVendor();

  const {
    data:    countriesData,
    loading: countriesLoading,
    error:   countriesError,
  } = useCountries();

  const {
    data,
    isLoading: _,
    refetch,
  } = useQuery<VendorsResponse>({
    queryFn:  () =>
                sdk.client.fetch(`/admin/vendors`, {
                  query: {
                    limit: PAGE_LIMIT,
                    offset,
                    ...(sorting?.id && {
                      order: `${sorting?.id}:${sorting?.desc ? "DESC" : "ASC"}`,
                    }),
                  },
                }),
    queryKey: [ [ "vendors", PAGE_LIMIT, offset, sorting ] ],
  });

  const commands = useCommands(mutateDelete, refetch, setRowSelection);

  const handleDelete = async () => {
    if (!selectedVendor) return;
    await mutateDelete(selectedVendor.id);
    refetch();
    toast.success(
      `Vendor ${selectedVendor.first_name} ${selectedVendor.last_name} deleted successfully`
    );
    setDeleteOpen(false);
    setSelectedVendor(null);
  };

  const actionColumn = getActionColumn(
    setSelectedVendor,
    setEditOpen,
    setDeleteOpen
  );

  const countryColumn = getCountryColumn({ countries: countriesData || [], countriesLoading })

  const tableColumns = [ ...columns, countryColumn, actionColumn ];

  const table = useDataTable({
    data:         data?.vendors || [],
    rowCount:     data?.count,
    columns:      tableColumns,
    commands,
    rowSelection: {
      state:                rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    getRowId:     (vendor) => vendor.id,
    pagination:   {
      state:              pagination,
      onPaginationChange: setPagination,
    },
    sorting:      {
      state:           sorting,
      onSortingChange: setSorting,
    },
    isLoading:    false,
  });

  return (
    <>
      <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex justify-between px-6 py-4">
            <Heading>Vendors</Heading>
            {!countriesLoading &&
              <VendorCreateDrawer
                refetch={refetch}
                countriesData={countriesData}
                countriesLoading={countriesLoading}
                countriesError={countriesError}/>
            }
          </DataTable.Toolbar>
          {data?.vendors && data?.vendors.length > 0 && (
            <>
              <DataTable.Table/>
              <DataTable.CommandBar
                selectedLabel={(count) => `${count} selected`}
              />
              <DataTable.Pagination/>
            </>
          )}
        </DataTable>
        {(!data?.vendors || data?.vendors.length === 0) && (
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
      {!countriesLoading &&
        <VendorUpdateDrawer
          vendor={selectedVendor || {}}
          refetch={refetch}
          open={editOpen}
          setOpen={setEditOpen}
          countriesData={countriesData}
          countriesLoading={countriesLoading}
          countriesError={countriesError}
        />
      }
      <DeletePrompt
        handleDelete={handleDelete}
        loading={loadingDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
      <Outlet/>
    </>
  );
};

export const config = defineRouteConfig({
  label: "Vendors",
  icon:  BuildingsSolid,
});

export default VendorsPage;
