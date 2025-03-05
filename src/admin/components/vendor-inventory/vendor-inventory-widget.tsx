import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  DataTablePaginationState,
  Toaster,
  toast,
} from "@medusajs/ui";
import { useState, useMemo } from "react";
import { useAdminVendors } from "../../hooks/use-admin-vendors.ts";
import { sdk } from "../../lib/sdk.ts";
import { DeletePrompt } from "../common/delete-prompt.tsx";
import { VendorTable } from "./vendor-table.tsx";

import {
  CreateUpdateVendorInventoryDTO,
  VendorInventory,
  VendorInventoryResponse,
} from "./types.ts";
import { VendorFormDrawer } from "./vendor-form-drawer.tsx";
export function VendorInventoryWidget({
  inventoryItemId,
}: {
  inventoryItemId: string;
}) {
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorInventory | null>(null);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [vendorIdToDelete, setVendorIdToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: vendorsData } = useAdminVendors();
  const PAGE_LIMIT = 20;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: PAGE_LIMIT,
    pageIndex: 0,
  });
  const { data, isLoading } = useQuery<VendorInventoryResponse>({
    queryKey: ["vendor-inventories", inventoryItemId, pagination.pageIndex],
    queryFn: () =>
      sdk.client.fetch(`/admin/vendor-inventory`, {
        query: {
          inventory_item_id: inventoryItemId,
          limit: PAGE_LIMIT,
          offset: pagination.pageIndex * PAGE_LIMIT,
        },
      }),
  });
  const createMutation = useMutation({
    mutationFn: (newVendorInventory: CreateUpdateVendorInventoryDTO) =>
      sdk.client.fetch(`/admin/vendor-inventory`, {
        method: "POST",
        body: newVendorInventory,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-inventories"] });
      setIsAddDrawerOpen(false);
      setEditingItem(null);
      toast.success("Vendor relationship created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create vendor relationship");
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & CreateUpdateVendorInventoryDTO) =>
      sdk.client.fetch(`/admin/vendor-inventory/${id}`, {
        method: "PUT",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-inventories"] });
      setEditingItem(null);
      setIsAddDrawerOpen(false);
      toast.success("Vendor relationship updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update vendor relationship");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      sdk.client.fetch(`/admin/vendor-inventory/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor-inventories"] });
      setIsDeletePromptOpen(false);
      setVendorIdToDelete(null);
      toast.success("Vendor relationship deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete vendor relationship");
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
      deleteMutation.mutate(vendorIdToDelete);
    }
  };
  const availableVendors = useMemo(() => {
    const assignedVendorIds = new Set(
      data?.vendor_inventories?.map((vi) => vi.vendor.id) || []
    );
    return (
      vendorsData?.vendors?.filter(
        (vendor) => !assignedVendorIds.has(vendor.id)
      ) || []
    );
  }, [vendorsData, data?.vendor_inventories]);
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
      <Toaster />
      <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
        <VendorTable
          data={data?.vendor_inventories}
          count={data?.count}
          isLoading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
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
          availableVendors={availableVendors}
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
