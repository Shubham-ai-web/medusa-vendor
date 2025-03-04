import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import {
    Container,
    Button,
    Heading,
    DataTable,
    createDataTableColumnHelper,
    useDataTable,
    DataTablePaginationState,
    Drawer,
    Toaster,
    toast,
} from "@medusajs/ui";
import { useState, useMemo } from "react";
import { useAdminVendors } from "../../hooks/use-admin-vendors";
import { sdk } from "../../lib/sdk";
import { ExclamationCircle, PencilSquare, Trash } from "@medusajs/icons";
import { ActionMenu } from "../../components/common/actions-menu.tsx";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VendorInventoryForm } from "../../components/vendor-inventory/vendor-inventory-form.tsx";
import { DeletePrompt } from "../../components/common/delete-prompt.tsx";

type VendorInventory = {
    id: string;
    inventory_item_id: string;
    price: number | null;
    turnaround_days: number | null;
    is_preferred: boolean;
    vendor: {
        id: string;
        first_name: string;
        last_name: string;
        company_name: string;
        email: string;
        phone: string;
        address: string;
    };
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

const schema = zod.object({
    vendor: zod.string().min(1, "Vendor is required").optional(),
    price: zod.number().min(0, "Price must be non-negative"),
    turnaround_days: zod.number().min(1, "Turnaround days must be at least 1"),
    is_preferred: zod.boolean(),
});

const columnHelper = createDataTableColumnHelper<VendorInventory>();

type ActionHandlers = {
    handleEdit: (item: VendorInventory) => void;
    openDeletePrompt: (id: string) => void;
};

const createColumns = ({ handleEdit, openDeletePrompt }: ActionHandlers) => [
    columnHelper.accessor("vendor.company_name", { header: "Vendor" }),
    columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => `$${info.getValue()?.toFixed(2) ?? "0.00"}`,
    }),
    columnHelper.accessor("turnaround_days", { header: "Turnaround Days" }),
    columnHelper.accessor("is_preferred", {
        header: "Preferred",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
            <ActionMenu
                groups={[
                    {
                        actions: [
                            {
                                icon: <PencilSquare />,
                                label: "Edit",
                                onClick: () => handleEdit(info.row.original),
                            },
                            {
                                icon: <Trash />,
                                label: "Delete",
                                onClick: () => openDeletePrompt(info.row.original.id),
                            },
                        ],
                    },
                ]}
            />
        ),
    }),
];

export function VendorInventoryWidget({ inventoryItemId }: { inventoryItemId: string }) {
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<VendorInventory | null>(null);
    const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
    const [vendorIdToDelete, setVendorIdToDelete] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const { data: vendorsData, isLoading: isVendorsLoading } = useAdminVendors();

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

    const initialFormValues = {
        vendor: "",
        price: null as number | null,
        turnaround_days: null as number | null,
        is_preferred: false,
    };

    const { handleSubmit, register, control, reset, formState: { errors } } = useForm({
        defaultValues: initialFormValues,
        resolver: zodResolver(schema),
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
            reset(initialFormValues);
            toast.success("Vendor relationship created successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to create vendor relationship");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }: { id: string } & CreateUpdateVendorInventoryDTO) =>
            sdk.client.fetch(`/admin/vendor-inventory/${id}`, {
                method: "PUT",
                body: data,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-inventories"] });
            setEditingItem(null);
            reset(initialFormValues);
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
        reset({
            price: item.price,
            turnaround_days: item.turnaround_days,
            is_preferred: item.is_preferred,
        });
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
        const assignedVendorIds = new Set(data?.vendor_inventories?.map((vi) => vi.vendor.id) || []);
        return vendorsData?.vendors?.filter((vendor) => !assignedVendorIds.has(vendor.id)) || [];
    }, [vendorsData, data?.vendor_inventories]);

    const columns = useMemo(
        () => createColumns({ handleEdit, openDeletePrompt }),
        [handleEdit, openDeletePrompt]
    );

    const table = useDataTable({
        columns,
        data: data?.vendor_inventories || [],
        rowCount: data?.count ?? 0,
        pagination: { state: pagination, onPaginationChange: setPagination },
        isLoading,
    });

    return (
        <>
            <Toaster />
            <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
                <DataTable instance={table}>
                    <DataTable.Toolbar className="flex justify-between px-6 py-4">
                        <Heading>Vendors</Heading>
                        <Button size="small" variant="secondary" onClick={() => setIsAddDrawerOpen(true)}>
                            Add Vendor
                        </Button>
                    </DataTable.Toolbar>
                    {data?.vendor_inventories?.length ? (
                        <>
                            <DataTable.Table />
                            <DataTable.Pagination />
                        </>
                    ) : (
                        <div className="flex h-[150px] w-full flex-col items-center justify-center gap-y-4 border-y">
                            <ExclamationCircle className="text-ui-fg-subtle" />
                            <p className="font-medium font-sans txt-compact-small">No vendors assigned</p>
                            <p className="font-normal font-sans txt-small text-ui-fg-muted">
                                Add a vendor to get started
                            </p>
                        </div>
                    )}
                </DataTable>

                {(isAddDrawerOpen || editingItem) && (
                    <Drawer
                        open={isAddDrawerOpen || !!editingItem}
                        onOpenChange={(open) => {
                            if (!open) {
                                setIsAddDrawerOpen(false);
                                setEditingItem(null);
                                reset(initialFormValues);
                            }
                        }}
                    >
                        <Drawer.Content>
                            <Drawer.Header>
                                <Drawer.Title>
                                    {editingItem ? "Edit Vendor Relationship" : "Add Vendor Relationship"}
                                </Drawer.Title>
                            </Drawer.Header>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <VendorInventoryForm
                                    register={register}
                                    loading={createMutation.isPending || updateMutation.isPending}
                                    error={createMutation.error || updateMutation.error}
                                    errors={errors}
                                    control={control}
                                    vendors={availableVendors}
                                    isEditing={!!editingItem}
                                />
                            </form>
                        </Drawer.Content>
                    </Drawer>
                )}
                <DeletePrompt
                    handleDelete={handleDelete}
                    loading={deleteMutation.isPending}
                    open={isDeletePromptOpen}
                    setOpen={setIsDeletePromptOpen}
                />
            </Container>
        </>
    );

    function onSubmit(formData: typeof initialFormValues) {
        const data: CreateUpdateVendorInventoryDTO = {
            inventory_item_id: inventoryItemId,
            price: formData.price ?? 0,
            turnaround_days: formData.turnaround_days ?? 1,
            is_preferred: formData.is_preferred,
            ...(formData.vendor && { vendor: formData.vendor }),
        };
        if (editingItem) {
            updateMutation.mutate({ id: editingItem.id, ...data });
        } else {
            createMutation.mutate(data);
        }
    }
}