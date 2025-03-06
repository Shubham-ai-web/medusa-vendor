import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons";
import { DropdownMenu, IconButton, toast } from "@medusajs/ui";
import { useState } from "react";
import { useDeleteVendor } from "../../hooks/vendor";
import { DeletePrompt } from "../common/delete-prompt";
import { VendorUpdateDrawer } from "./vendor-update-drawer";

export const VendorActionsMenu = ({
                                    vendor,
                                    refetch,
                                  }: {
  vendor: any;
  refetch: () => void;
}) => {
  const [ editOpen, setEditOpen ] = useState(false);
  const [ deleteOpen, setDeleteOpen ] = useState(false);
  const { mutate: mutateDelete, loading: loadingDelete } = useDeleteVendor();

  const handleDelete = async () => {
    await mutateDelete(vendor.id);
    refetch();
    toast.success(`Company ${vendor.name} deleted successfully`);
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
            onClick={() => setEditOpen(true)}
          >
            <PencilSquare/>
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Separator/>
          <DropdownMenu.Item
            className="gap-x-2"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash/>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <VendorUpdateDrawer
        vendor={vendor}
        refetch={refetch}
        open={editOpen}
        setOpen={setEditOpen}
      />
      <DeletePrompt
        handleDelete={handleDelete}
        loading={loadingDelete}
        open={deleteOpen}
        setOpen={setDeleteOpen}
      />
    </>
  );
};
