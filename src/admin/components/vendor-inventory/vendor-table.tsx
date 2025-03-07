import {
  Button,
  Heading,
  DataTable,
  createDataTableColumnHelper,
  useDataTable,
  DataTablePaginationState,
  DataTableSortingState,
} from "@medusajs/ui";
import { ExclamationCircle, PencilSquare, Spinner, Trash } from "@medusajs/icons";
import { ActionMenu } from "../common/actions-menu.tsx";
import { VendorInventory } from "./types";

type ActionHandlers = {
  handleEdit: (item: VendorInventory) => void;
  openDeletePrompt: (id: string) => void;
};

const columnHelper = createDataTableColumnHelper<VendorInventory>();

const createColumns = ({ handleEdit, openDeletePrompt }: ActionHandlers) => [
  columnHelper.accessor("vendor.company_name", {
    header: "Vendor",
  }),
  columnHelper.accessor("price", {
    header:        "Price",
    cell:          (info) => `$${info.getValue()?.toFixed(2) ?? "0.00"}`,
    enableSorting: true,
  }),
  columnHelper.accessor("turnaround_days", {
    header:        "Turnaround Days",
    enableSorting: true,
  }),
  columnHelper.accessor("is_preferred", {
    header:        "Preferred",
    cell:          (info) => info.getValue() ? "Yes" : "No",
    enableSorting: true,
  }),
  columnHelper.accessor("inventory_sku", {
    header: "Inventory SKU",
  }),
  columnHelper.display({
    id:     "actions",
    header: "Actions",
    cell:   (info) => (
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon:    <PencilSquare/>,
                label:   "Edit",
                onClick: () => handleEdit(info.row.original),
              },
              {
                icon:    <Trash/>,
                label:   "Delete",
                onClick: () => openDeletePrompt(info.row.original.id),
              },
            ],
          },
        ]}
      />
    ),
  }),
];

interface VendorTableProps {
  data: VendorInventory[] | undefined;
  count: number | undefined;
  isLoading: boolean;
  isFetching: boolean;
  pagination: DataTablePaginationState;
  setPagination: (pagination: DataTablePaginationState) => void;
  sorting: DataTableSortingState | null;
  setSorting: (sorting: DataTableSortingState) => void;
  handleEdit: (item: VendorInventory) => void;
  openDeletePrompt: (id: string) => void;
  onAddVendor: () => void;
}

export const VendorTable = ({
                              data,
                              count,
                              isLoading,
                              isFetching,
                              pagination,
                              setPagination,
                              sorting,
                              setSorting,
                              handleEdit,
                              openDeletePrompt,
                              onAddVendor,
                            }: VendorTableProps) => {
  const columns = createColumns({ handleEdit, openDeletePrompt });

  const table = useDataTable({
    columns,
    data:       data || [],
    rowCount:   count ?? 0,
    pagination: { state: pagination, onPaginationChange: setPagination },
    sorting:    {
      state:           sorting,
      onSortingChange: setSorting,
    },
    isLoading,
  });

  return (
    <div className="relative">
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex justify-between px-6 py-4">
          <Heading>Vendors</Heading>
          <Button size="small" variant="secondary" onClick={onAddVendor}>
            Add Vendor
          </Button>
        </DataTable.Toolbar>
        {count && count > 0 ? (
          <>
            <DataTable.Table/>
            <DataTable.Pagination/>
          </>
        ) : isFetching ? (
          <div className="flex h-[150px] w-full flex-col items-center justify-center gap-y-4 border-y">
            <Spinner className="animate-spin"/>
          </div>
        ) : (
          <div className="flex h-[150px] w-full flex-col items-center justify-center gap-y-4 border-y">
            <ExclamationCircle className="text-ui-fg-subtle"/>
            <p className="font-medium font-sans txt-compact-small">No vendors assigned</p>
            <p className="font-normal font-sans txt-small text-ui-fg-muted">
              Add a vendor to get started
            </p>
          </div>
        )}
      </DataTable>
    </div>
  );
};