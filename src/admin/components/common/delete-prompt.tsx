import { Trash } from "@medusajs/icons";
import { Button, Prompt, Text, toast } from "@medusajs/ui";

interface DeletePromptProps {
  handleDelete: () => Promise<void>;
  loading: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DeletePrompt = ({
                               handleDelete,
                               loading,
                               open,
                               setOpen,
                             }: DeletePromptProps) => {
  const handleConfirmDelete = async () => {
    try {
      await handleDelete();
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete the item");
    }
  };

  return (
    <Prompt open={open} onOpenChange={setOpen}>
      <Prompt.Content className="max-w-md rounded-lg bg-ui-bg-base shadow-elevation-modal">
        <div className="p-6">
          <Prompt.Title className="text-ui-fg-base text-lg font-semibold">
            Confirm Deletion
          </Prompt.Title>
          <Text className="mt-2 text-ui-fg-subtle text-sm">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Text>
        </div>
        <Prompt.Footer className="flex justify-end gap-x-2 border-t border-ui-border-base p-4">
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="min-w-[80px]"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={loading}
            disabled={loading}
            className="min-w-[80px] flex items-center gap-x-1"
          >
            <Trash className="h-4 w-4"/>
            Delete
          </Button>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  );
};
