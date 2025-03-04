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
} from "@medusajs/ui";
import { useState, useMemo } from "react";
import { useAdminVendors } from "../../hooks/use-admin-vendors";
import { sdk } from "../../lib/sdk";
import { PencilSquare, Trash } from "@medusajs/icons";
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

const schema = zod.object( {
    vendor: zod.string().min( 1, "Vendor is required" ).optional(),
    price: zod.number().min( 1, "Price must be positive" ),
    turnaround_days: zod.number().min( 1, "Turnaround days must be at least 1" ),
    is_preferred: zod.boolean(),
} );

const columnHelper = createDataTableColumnHelper<VendorInventory>();

export function VendorInventoryWidget( { inventoryItemId }: { inventoryItemId: string } ) {
    const [ isAddDrawerOpen, setIsAddDrawerOpen ] = useState( false );
    const [ editingItem, setEditingItem ] = useState<VendorInventory | null>( null );
    const [ isDeletePromptOpen, setIsDeletePromptOpen ] = useState( false );
    const [ vendorIdToDelete, setVendorIdToDelete ] = useState<string | null>( null );
    const queryClient = useQueryClient();
    const { data: vendorsData } = useAdminVendors();

    const PAGE_LIMIT = 20;
    const [ pagination, setPagination ] = useState<DataTablePaginationState>( {
        pageSize: PAGE_LIMIT,
        pageIndex: 0,
    } );

    const offset = useMemo( () => {
        return pagination.pageIndex * PAGE_LIMIT;
    }, [ pagination ] );

    const { data, isLoading: _, refetch: _1 } = useQuery<VendorInventoryResponse>( {
        queryKey: [ [ "vendor-inventories", inventoryItemId, PAGE_LIMIT, offset ] ],
        queryFn: () =>
            sdk.client.fetch( `/admin/vendor-inventory`, {
                query: {
                    inventory_item_id: inventoryItemId,
                    limit: PAGE_LIMIT,
                    offset,
                },
            } ),
    } );

    const initialFormValues: {
        vendor: string,
        price: number | null,
        turnaround_days: number | null,
        is_preferred: boolean
    } = {
        vendor: "",
        price: null,
        turnaround_days: null,
        is_preferred: false,
    };

    const { handleSubmit, register, control, reset, formState: { errors } } = useForm( {
        defaultValues: initialFormValues,
        resolver: zodResolver( schema ),
    } );

    const createMutation = useMutation( {
        mutationFn: ( newVendorInventory: CreateUpdateVendorInventoryDTO ) =>
            sdk.client.fetch( `/admin/vendor-inventory`, {
                method: "POST",
                body: newVendorInventory,
            } ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ [ "vendor-inventories" ] ] } );
            setIsAddDrawerOpen( false );
            reset( initialFormValues );
        },
        onError: ( error: Error ) => {
            alert( error.message || "Failed to create vendor relationship. The vendor might already be assigned to this item." );
        },
    } );

    const updateMutation = useMutation( {
        mutationFn: ( { id, ...data }: { id: string } & CreateUpdateVendorInventoryDTO ) =>
            sdk.client.fetch( `/admin/vendor-inventory/${ id }`, {
                method: "PUT",
                body: data,
            } ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ [ "vendor-inventories" ] ] } );
            setEditingItem( null );
            reset( initialFormValues );
        },
        onError: ( error: Error ) => {
            alert( error.message || "Failed to update vendor relationship" );
        },
    } );

    const deleteMutation = useMutation( {
        mutationFn: ( id: string ) =>
            sdk.client.fetch( `/admin/vendor-inventory/${ id }`, {
                method: "DELETE",
            } ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ [ "vendor-inventories" ] ] } );
        },
        onError: ( error: Error ) => {
            alert( error.message || "Failed to delete vendor relationship" );
        },
    } );

    const handleEdit = ( item: VendorInventory ) => {
        setEditingItem( item );
        reset( {
            price: item.price,
            turnaround_days: item.turnaround_days,
            is_preferred: item.is_preferred,
        } );
    };

    const handleDelete = async () => {
        if ( vendorIdToDelete ) {
            await deleteMutation.mutateAsync( vendorIdToDelete );
        }
    };

    const openDeletePrompt = ( id: string ) => {
        setVendorIdToDelete( id );
        setIsDeletePromptOpen( true );
    };

    const handleAddDrawerOpen = () => {
        setIsAddDrawerOpen( true );
        reset( initialFormValues );
    };

    const onSubmit = ( formData: any ) => {
        const data = {
            inventory_item_id: inventoryItemId,
            price: formData.price,
            turnaround_days: formData.turnaround_days,
            is_preferred: formData.is_preferred,
        };
        if ( editingItem ) {
            updateMutation.mutate( { id: editingItem.id, ...data } );
        } else {
            createMutation.mutate( { vendor: formData.vendor, ...data } );
        }
    };

    const availableVendors = useMemo( () => {

        const assignedVendorIds = new Set( data?.vendor_inventories?.map( ( vi ) => vi.vendor.id ) || [] );

        return vendorsData?.vendors?.filter( ( vendor ) => !assignedVendorIds.has( vendor.id ) ) || [];

    }, [ vendorsData, data?.vendor_inventories ] );

    const columns = [
        columnHelper.accessor( "vendor.company_name", { header: "Vendor" } ),
        columnHelper.accessor( "price", {
            header: "Price",
            cell: ( info ) => info.getValue() ? `$${ info.getValue()!.toFixed( 2 ) }` : '$0.00',
        } ),
        columnHelper.accessor( "turnaround_days", { header: "Turnaround Days" } ),
        columnHelper.accessor( "is_preferred", {
            header: "Preferred",
            cell: ( info ) => ( info.getValue() ? "Yes" : "No" ),
        } ),
        columnHelper.display( {
            id: "actions",
            header: "Actions",
            cell: ( info ) => (
                <ActionMenu
                    groups={ [
                        {
                            actions: [
                                {
                                    icon: <PencilSquare/>,
                                    label: "Edit",
                                    onClick: () => handleEdit( info.row.original ),
                                },
                                {
                                    icon: <Trash/>,
                                    label: "Delete",
                                    onClick: () => openDeletePrompt( info.row.original.id ),
                                },
                            ],
                        },
                    ] }
                />
            ),
        } ),
    ];

    const table = useDataTable( {
        columns,
        data: data?.vendor_inventories || [],
        rowCount: data?.count,
        pagination: {
            state: pagination,
            onPaginationChange: setPagination,
        },
        isLoading: false,
    } );

    return (
        <>
            <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
                <DataTable instance={ table }>
                    <DataTable.Toolbar className="flex justify-between px-6 py-4">
                        <Heading>Vendors</Heading>
                        <Button size="small" variant="secondary" onClick={ handleAddDrawerOpen }>
                            Add Vendor
                        </Button>
                    </DataTable.Toolbar>
                    { data?.vendor_inventories && data?.vendor_inventories?.length > 0 && (
                        <>
                            <DataTable.Table/>
                            <DataTable.CommandBar selectedLabel={ ( count ) => `${ count } selected` }/>
                            <DataTable.Pagination/>
                        </>
                    ) }
                    { ( !data?.vendor_inventories || data?.vendor_inventories.length === 0 ) && (
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
                    ) }
                </DataTable>

                { ( isAddDrawerOpen || editingItem ) && (
                    <Drawer open={ isAddDrawerOpen || !!editingItem } onOpenChange={ ( open ) => {
                        if ( !open ) {
                            setIsAddDrawerOpen( false );
                            setEditingItem( null );
                            reset( initialFormValues );
                        }
                    } }>
                        <Drawer.Content>
                            <Drawer.Header>
                                <Drawer.Title>
                                    { editingItem ? "Edit Vendor Relationship" : "Add Vendor Relationship" }
                                </Drawer.Title>
                            </Drawer.Header>
                            <form onSubmit={ handleSubmit( onSubmit ) }>
                                <VendorInventoryForm
                                    register={ register }
                                    loading={ createMutation.isPending || updateMutation.isPending }
                                    error={ createMutation.error || updateMutation.error }
                                    errors={ errors }
                                    control={ control }
                                    vendors={ availableVendors }
                                    isEditing={ !!editingItem }
                                />
                            </form>
                        </Drawer.Content>
                    </Drawer>
                ) }
                <DeletePrompt
                    handleDelete={ handleDelete }
                    loading={ deleteMutation.isPending }
                    open={ isDeletePromptOpen }
                    setOpen={ setIsDeletePromptOpen }

                />
            </Container>
        </>
    );
}