import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Container, DataTablePaginationState, Toaster, toast, DataTableSortingState } from "@medusajs/ui";
import { useState, useMemo } from "react";
import { useAdminVendors } from "../../hooks/use-admin-vendors";
import { sdk } from "../../lib/sdk";
import { DeletePrompt } from "../common/delete-prompt.tsx";
import { VendorInventoryResponse, CreateUpdateVendorInventoryDTO, VendorInventory } from "./types";
import { VendorFormDrawer } from "./vendor-form-drawer.tsx";
import { VendorTable } from "./vendor-table.tsx";

export function VendorInventoryWidget({ inventoryItemId }: { inventoryItemId: string }) {
  const [ isAddDrawerOpen, setIsAddDrawerOpen ] = useState(false);
  const [ editingItem, setEditingItem ] = useState<VendorInventory | null>(null);
  const [ isDeletePromptOpen, setIsDeletePromptOpen ] = useState(false);
  const [ vendorIdToDelete, setVendorIdToDelete ] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: vendorsData } = useAdminVendors();
  const PAGE_LIMIT = 1;
  const [ pagination, setPagination ] = useState<DataTablePaginationState>({
    pageSize:  PAGE_LIMIT,
    pageIndex: 0,
  });
  const offset = useMemo(() => {
    return pagination.pageIndex * PAGE_LIMIT
  }, [ pagination ]);
  const [ sorting, setSorting ] = useState<DataTableSortingState | null>(null);

  const { data: paginatedData, isLoading, isFetching } = useQuery<VendorInventoryResponse>({
    queryKey: [ "vendor-inventories", inventoryItemId, PAGE_LIMIT, offset, sorting ],
    queryFn:  () =>
                sdk.client.fetch(`/admin/vendor-inventory`, {
                  query: {
                    inventory_item_id: inventoryItemId,
                    limit:             PAGE_LIMIT,
                    offset,
                    ...(sorting?.id && {
                      order: `${sorting?.id}:${sorting?.desc ? "DESC" : "ASC"}`,
                    }),
                  },
                }),
  });

  const { data: assignedVendorIds } = useQuery<{ vendors: any[] }>({
    queryKey: [ "assigned-vendor-ids", inventoryItemId ],
    queryFn:  () =>
                sdk.client.fetch(`/admin/vendor-inventory/selection`, {
                  query: {
                    inventory_item_id: inventoryItemId,
                  },
                }),
  });
  const createMutation = useMutation({
    mutationFn: (newVendorInventory: CreateUpdateVendorInventoryDTO) =>
                  sdk.client.fetch(`/admin/vendor-inventory`, {
                    method: "POST",
                    body:   newVendorInventory,
                  }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [ "vendor-inventories" ] });
      queryClient.invalidateQueries({ queryKey: [ "assigned-vendor-ids", inventoryItemId ] });
      setIsAddDrawerOpen(false);
      setEditingItem(null);
      toast.success("Vendor association created successfully");
    },
    onError:    (error: Error) => {
      toast.error(error.message || "Failed to create Vendor association");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & CreateUpdateVendorInventoryDTO) =>
                  sdk.client.fetch(`/admin/vendor-inventory/${id}`, {
                    method: "PUT",
                    body:   data,
                  }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [ "vendor-inventories" ] });
      queryClient.invalidateQueries({ queryKey: [ "assigned-vendor-ids", inventoryItemId ] });
      setEditingItem(null);
      setIsAddDrawerOpen(false);
      toast.success("Vendor association updated successfully");
    },
    onError:    (error: Error) => {
      toast.error(error.message || "Failed to update Vendor association");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
                  sdk.client.fetch(`/admin/vendor-inventory/${id}`, {
                    method: "DELETE",
                  }),
    onSuccess:  () => {
      queryClient.invalidateQueries({ queryKey: [ "vendor-inventories" ] });
      queryClient.invalidateQueries({ queryKey: [ "assigned-vendor-ids", inventoryItemId ] });
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      setIsDeletePromptOpen(false);
      setVendorIdToDelete(null);
      toast.success("Vendor association deleted successfully");
    },
    onError:    (error: Error) => {
      toast.error(error.message || "Failed to delete Vendor association");
    },
  });

  const handleEdit = (item: VendorInventory) => {
    setEditingItem(item);
    setIsAddDrawerOpen(true);
  };

  const openDeletePrompt = (id: string) => {
    setVendorIdToDelete(id);
    setIsDeletePromptOpen(true);
  };

  const handleDelete = async () => {
    if (vendorIdToDelete) {
      await deleteMutation.mutateAsync(vendorIdToDelete);
    }
  };

  const handleFormSubmit = (data: CreateUpdateVendorInventoryDTO) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDrawerClose = () => {
    setIsAddDrawerOpen(false);
    setEditingItem(null);
  };

  return (
    <>
      <Toaster/>
      <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
        <VendorTable
          data={paginatedData?.vendor_inventories}
          count={paginatedData?.count}
          isLoading={isLoading}
          isFetching={isFetching}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          handleEdit={handleEdit}
          openDeletePrompt={openDeletePrompt}
          onAddVendor={() => setIsAddDrawerOpen(true)}
        />
        <VendorFormDrawer
          open={isAddDrawerOpen}
          onOpenChange={(open) => {
            if (!open) {
              handleDrawerClose();
            } else {
              setIsAddDrawerOpen(true);
            }
          }}
          editingItem={editingItem}
          inventoryItemId={inventoryItemId}
          availableVendors={assignedVendorIds?.vendors || []}
          onSubmit={handleFormSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error || updateMutation.error}
        />
        <DeletePrompt
          handleDelete={handleDelete}
          loading={deleteMutation.isPending}
          open={isDeletePromptOpen}
          setOpen={setIsDeletePromptOpen}
        />
      </Container>
    </>
  );
}