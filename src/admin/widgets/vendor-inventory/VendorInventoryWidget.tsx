import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Container,
  Button,
  Heading,
  Input,
  Label,
  Switch,
  DataTable,
  createDataTableColumnHelper,
  useDataTable,
  DataTablePaginationState,
} from "@medusajs/ui";
import { useState, useMemo } from "react";
import { useAdminVendors } from "../../hooks/use-admin-vendors";
import { sdk } from "../../lib/sdk";
import { PencilSquare, Trash } from "@medusajs/icons";
import { ActionMenu } from "../../components/common/actions-menu.tsx";

type VendorInventory = {
  id: string;
  inventory_item_id: string;
  price: number;
  turnaround_days: number;
  is_preferred: boolean;
  vendor: {
    id: string;
    first_name: string;
    last_name: string;
    company_name: string;
    email: string;
    phone: string;
    address: string;
  }
};

type VendorInventoryResponse = {
  vendor_inventories: VendorInventory[];
  count: number;
  limit: number;
  offset: number;
};

type CreateUpdateVendorInventoryDTO = {
  vendor?: string;
  inventory_item_id: string;
  price: number;
  turnaround_days: number;
  is_preferred: boolean;
};

const columnHelper = createDataTableColumnHelper<VendorInventory>();

export function VendorInventoryWidget({ inventoryItemId }: { inventoryItemId: string }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorInventory | null>(null);
  const queryClient = useQueryClient();
  const { data: vendorsData } = useAdminVendors();

  const PAGE_LIMIT = 20;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize:  PAGE_LIMIT,
    pageIndex: 0,
  });

  const offset = useMemo(() => {
    return pagination.pageIndex * PAGE_LIMIT
  }, [pagination]);

  const { data, isLoading: _, refetch: _1 } = useQuery<VendorInventoryResponse>({
    queryKey: [["vendor-inventories", inventoryItemId, PAGE_LIMIT, offset]],
    queryFn:  () => sdk.client.fetch(
      `/admin/vendor-inventory`,
      {
        query: {
          inventory_item_id: inventoryItemId,
          limit: PAGE_LIMIT,
          offset,
          // ...(sorting?.id && {
          //   order: `${sorting?.id}:${sorting?.desc ? "DESC" : "ASC"}`,
          // }),
        },
      }
    ),
  });

  const handleEdit = (item: VendorInventory) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor relationship?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    columnHelper.accessor("vendor.company_name", {
      header: "Vendor",
    }),
    columnHelper.accessor("price", {
      header: "Price",
      cell:   (info) => `$${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor("turnaround_days", {
      header: "Turnaround Days",
    }),
    columnHelper.accessor("is_preferred", {
      header: "Preferred",
      cell:   (info) => info.getValue() ? "Yes" : "No",
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
                  onClick: () => {
                    // setSelectedVendor(row.original);
                    // setEditOpen(true);
                    handleEdit(info.row.original)
                  },
                },
                {
                  icon:    <Trash/>,
                  label:   "Delete",
                  onClick: () => {
                    // setSelectedVendor(row.original);
                    // setDeleteOpen(true);
                    handleDelete(info.row.original.id)
                  },
                },
              ],
            },
          ]}
        />
      ),
    }),
  ];

  const table = useDataTable({
    columns,
    data:       data?.vendor_inventories || [],
    rowCount: data?.count,
    pagination: {
      state:              pagination,
      onPaginationChange: setPagination,
    },
    isLoading:  false,
  });

  const createMutation = useMutation({
    mutationFn: (newVendorInventory: CreateUpdateVendorInventoryDTO) =>
                  sdk.client.fetch(`/admin/vendor-inventory`, {
                    method: "POST",
                    body:   newVendorInventory,
                  }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [["vendor-inventories"]] })
      setIsAddModalOpen(false)
    },
    onError:    (error: Error) => {
      alert(error.message || "Failed to create vendor relationship. The vendor might already be assigned to this item.")
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & CreateUpdateVendorInventoryDTO) =>
                  sdk.client.fetch(`/admin/vendor-inventory/${id}`, {
                    method: "PUT",
                    body:   data,
                  }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [["vendor-inventories"]] })
      setEditingItem(null)
    },
    onError:    (error: Error) => {
      alert(error.message || "Failed to update vendor relationship")
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
                  sdk.client.fetch(`/admin/vendor-inventory/${id}`, {
                    method: "DELETE",
                  }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [["vendor-inventories"]] })
    },
    onError:    (error: Error) => {
      alert(error.message || "Failed to delete vendor relationship")
    }
  });

  return (
    <>
      <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex justify-between px-6 py-4">
            <Heading>Vendors</Heading>
            {/*<VendorCreateDrawer refetch={refetch}/>*/}
            <Button size="small" variant="secondary" onClick={() => setIsAddModalOpen(true)}>
              Add Vendor
            </Button>
          </DataTable.Toolbar>
          {data?.vendor_inventories && data?.vendor_inventories?.length > 0 && (
            <>
              <DataTable.Table/>
              <DataTable.CommandBar selectedLabel={(count) => `${count} selected`}/>
              <DataTable.Pagination/>
            </>
          )}
          {(!data?.vendor_inventories || data?.vendor_inventories.length === 0) && (
            <div className="flex h-[150px] w-full flex-col items-center justify-center gap-y-4 border-y">
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
                  <p className="font-medium font-sans txt-compact-small">No records</p>
                  <p className="font-normal font-sans txt-small text-ui-fg-muted">
                    There are no records to show
                  </p>
                </div>
              </div>
            </div>
          )}
        </DataTable>

        {(isAddModalOpen || editingItem) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
              <Heading className="mb-4">
                {editingItem ? "Edit Vendor Relationship" : "Add Vendor Relationship"}
              </Heading>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  const data = {
                    vendor:         formData.get("vendor") as string,
                    inventory_item_id: inventoryItemId,
                    price:             parseFloat(formData.get("price") as string),
                    turnaround_days:   parseInt(formData.get("turnaround_days") as string),
                    is_preferred:      formData.get("is_preferred") === "true",
                  };

                  if (editingItem) {
                    updateMutation.mutate({ id: editingItem.id, ...data });
                  } else {
                    createMutation.mutate(data);
                  }
                }}
              >
                <div className="space-y-4">
                  {!editingItem && (
                    <div>
                      <Label htmlFor="vendor">Vendor</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        name="vendor"
                        required
                      >
                        <option value="">Select a vendor...</option>
                        {vendorsData?.vendors?.map((vendor) => (
                          <option key={vendor.id} value={vendor.id}>
                            {`${vendor.company_name} <${vendor.email}>`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingItem?.price}
                    />
                  </div>

                  <div>
                    <Label htmlFor="turnaround_days">Turnaround Days</Label>
                    <Input
                      id="turnaround_days"
                      name="turnaround_days"
                      type="number"
                      required
                      defaultValue={editingItem?.turnaround_days}
                    />
                  </div>

                  <div>
                    <Label htmlFor="is_preferred">Preferred Vendor</Label>
                    <Switch
                      id="is_preferred"
                      name="is_preferred"
                      value="true"
                      defaultChecked={editingItem?.is_preferred}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsAddModalOpen(false)
                        setEditingItem(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingItem ? "Update" : "Create"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </>
  )
};