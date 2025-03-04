import { EllipsisHorizontal, Trash } from "@medusajs/icons";
import { DropdownMenu, IconButton, toast } from "@medusajs/ui";
import { useState } from "react";
import { useDeleteVendor } from "../../hooks/vendor";
import { DeletePrompt } from "../common/delete-prompt";

export const ProductVendorActionsMenu = ( {
                                              vendor,
                                              refetch,
                                          }: {
    vendor: any;
    refetch: () => void;
} ) => {
    const [ deleteOpen, setDeleteOpen ] = useState( false );
    const { mutate: mutateDelete, loading: loadingDelete } = useDeleteVendor();

    const handleDelete = async () => {
        await mutateDelete( vendor.id );
        refetch();
        toast.success( `Vendor ${ vendor.name } removed successfully` );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                    <IconButton variant="transparent">
                        <EllipsisHorizontal/>
                    </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                    <DropdownMenu.Item
                        className="gap-x-2"
                        onClick={ () => setDeleteOpen( true ) }
                    >
                        <Trash/>
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
            <DeletePrompt
                handleDelete={ handleDelete }
                loading={ loadingDelete }
                open={ deleteOpen }
                setOpen={ setDeleteOpen }
            />
        </>
    );
};
