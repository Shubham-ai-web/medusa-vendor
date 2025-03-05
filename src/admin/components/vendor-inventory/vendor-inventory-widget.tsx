import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { Container, DataTablePaginationState, Toaster, toast } from "@medusajs/ui";
import { useState, useMemo } from "react";
import { useAdminVendors } from "../../hooks/use-admin-vendors";
import { sdk } from "../../lib/sdk";
import { DeletePrompt } from "../../components/common/delete-prompt.tsx";
import { VendorInventoryResponse, CreateUpdateVendorInventoryDTO, VendorInventory } from "./types";
import { VendorFormDrawer } from "./vendor-form-drawer.tsx";
import { VendorTable } from "./vendor-table.tsx";

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

    const { data: fullData, isLoading, isFetching } = useQuery<VendorInventoryResponse>( {
        queryKey: [ "vendor-inventories", inventoryItemId ],
        queryFn: () =>
            sdk.client.fetch( `/admin/vendor-inventory`, {
                query: {
                    inventory_item_id: inventoryItemId,
                },
            } ),
    } );

    const paginatedData = useMemo( () => {
        if ( !fullData?.vendor_inventories ) return { vendor_inventories: [], count: 0, limit: PAGE_LIMIT, offset: 0 };
        const start = pagination.pageIndex * PAGE_LIMIT;
        const end = start + PAGE_LIMIT;
        return {
            vendor_inventories: fullData.vendor_inventories.slice( start, end ),
            count: fullData.vendor_inventories.length,
            limit: PAGE_LIMIT,
            offset: start,
        };
    }, [ fullData, pagination.pageIndex ] );
    const createMutation = useMutation( {
        mutationFn: ( newVendorInventory: CreateUpdateVendorInventoryDTO ) =>
            sdk.client.fetch( `/admin/vendor-inventory`, {
                method: "POST",
                body: newVendorInventory,
            } ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ "vendor-inventories" ] } );
            setIsAddDrawerOpen( false );
            setEditingItem( null );
            toast.success( "Vendor preference created successfully" );
        },
        onError: ( error: Error ) => {
            toast.error( error.message || "Failed to create vendor preference" );
        },
    } );
    const updateMutation = useMutation( {
        mutationFn: ( { id, ...data }: { id: string } & CreateUpdateVendorInventoryDTO ) =>
            sdk.client.fetch( `/admin/vendor-inventory/${ id }`, {
                method: "PUT",
                body: data,
            } ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ "vendor-inventories" ] } );
            setEditingItem( null );
            setIsAddDrawerOpen( false );
            toast.success( "Vendor preference updated successfully" );
        },
        onError: ( error: Error ) => {
            toast.error( error.message || "Failed to update vendor preference" );
        },
    } );
    const deleteMutation = useMutation( {
        mutationFn: ( id: string ) =>
            sdk.client.fetch( `/admin/vendor-inventory/${ id }`, {
                method: "DELETE",
            } ),
        onSuccess: () => {
            queryClient.invalidateQueries( { queryKey: [ "vendor-inventories" ] } );
            setPagination( ( prev ) => ( { ...prev, pageIndex: 0 } ) );
            setIsDeletePromptOpen( false );
            setVendorIdToDelete( null );
            toast.success( "Vendor preference deleted successfully" );
        },
        onError: ( error: Error ) => {
            toast.error( error.message || "Failed to delete vendor preference" );
        },
    } );
    const handleEdit = ( item: VendorInventory ) => {
        setEditingItem( item );
        setIsAddDrawerOpen( true );
    };
    const openDeletePrompt = ( id: string ) => {
        setVendorIdToDelete( id );
        setIsDeletePromptOpen( true );
    };
    const handleDelete = async () => {
        if ( vendorIdToDelete ) {
            await deleteMutation.mutateAsync( vendorIdToDelete );
        }
    };
    const availableVendors = useMemo( () => {
        const assignedVendorIds = new Set( fullData?.vendor_inventories?.map( ( vi ) => vi.vendor.id ) || [] );
        return vendorsData?.vendors?.filter( ( vendor ) => !assignedVendorIds.has( vendor.id ) ) || [];
    }, [ vendorsData, fullData?.vendor_inventories ] );
    const handleFormSubmit = ( data: CreateUpdateVendorInventoryDTO ) => {
        if ( editingItem ) {
            updateMutation.mutate( { id: editingItem.id, ...data } );
        } else {
            createMutation.mutate( data );
        }
    };
    const handleDrawerClose = () => {
        setIsAddDrawerOpen( false );
        setEditingItem( null );
    };
    return (
        <>
            <Toaster/>
            <Container className="shadow-elevation-card-rest bg-ui-bg-base w-full rounded-lg divide-y p-0">
                <VendorTable
                    data={ paginatedData.vendor_inventories }
                    count={ paginatedData.count }
                    isLoading={ isLoading }
                    isFetching={ isFetching }
                    pagination={ pagination }
                    setPagination={ setPagination }
                    handleEdit={ handleEdit }
                    openDeletePrompt={ openDeletePrompt }
                    onAddVendor={ () => setIsAddDrawerOpen( true ) }
                />
                <VendorFormDrawer
                    open={ isAddDrawerOpen }
                    onOpenChange={ ( open ) => {
                        if ( !open ) {
                            handleDrawerClose();
                        } else {
                            setIsAddDrawerOpen( true );
                        }
                    } }
                    editingItem={ editingItem }
                    inventoryItemId={ inventoryItemId }
                    availableVendors={ availableVendors }
                    onSubmit={ handleFormSubmit }
                    loading={ createMutation.isPending || updateMutation.isPending }
                    error={ createMutation.error || updateMutation.error }
                />
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