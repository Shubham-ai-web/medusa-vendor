import { Button, Drawer, Input, Label, Select, Switch, Text } from "@medusajs/ui";
import { Controller } from "react-hook-form";

export function VendorInventoryForm( {
                                         register,
                                         loading,
                                         error,
                                         errors,
                                         control,
                                         vendors,
                                         isEditing = false,
                                     }: {
    register: any;
    loading: boolean;
    error: Error | null;
    errors: any;
    control: any;
    vendors: { id: string; company_name: string; email: string }[];
    isEditing?: boolean;
} ) {
    return (
        <>
            <Drawer.Body className="px-6 py-4 flex flex-1 flex-col gap-y-8 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    { !isEditing && (
                        <div className="flex flex-col space-y-2">
                            <Label size="xsmall">Vendor</Label>
                            <Controller
                                name="vendor"
                                control={ control }
                                render={ ( { field } ) => (
                                    <Select
                                        value={ field.value }
                                        onValueChange={ field.onChange }
                                        disabled={ loading }
                                    >
                                        <Select.Trigger>
                                            <Select.Value placeholder="Select a vendor"/>
                                        </Select.Trigger>
                                        <Select.Content>
                                            { vendors.length > 0 ? (
                                                vendors.map( ( vendor ) => (
                                                    <Select.Item key={ vendor.id } value={ vendor.id }>
                                                        { `${ vendor.company_name } <${ vendor.email }>` }
                                                    </Select.Item>
                                                ) )
                                            ) : (
                                                <Select.Item disabled value="No vendors available">
                                                    No vendors available
                                                </Select.Item>
                                            ) }
                                        </Select.Content>
                                    </Select>
                                ) }
                            />
                            { errors.vendor && (
                                <span className="text-red-500 text-sm">{ errors.vendor.message }</span>
                            ) }
                        </div>
                    ) }

                    <div className="flex flex-col space-y-2">
                        <Label size="xsmall">Price</Label>
                        <Input
                            { ...register( "price", {
                                required: "Price is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Price must be positive" },
                            } ) }
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                        />
                        { errors.price && (
                            <span className="text-red-500 text-sm">{ errors.price.message }</span>
                        ) }
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label size="xsmall">Turnaround Days</Label>
                        <Input
                            { ...register( "turnaround_days", {
                                required: "Turnaround days is required",
                                valueAsNumber: true,
                                min: { value: 1, message: "Turnaround days must be at least 1" },
                            } ) }
                            type="number"
                            placeholder="1"
                        />
                        { errors.turnaround_days && (
                            <span className="text-red-500 text-sm">{ errors.turnaround_days.message }</span>
                        ) }
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label size="xsmall">Preferred Vendor</Label>
                        <Controller
                            name="is_preferred"
                            control={ control }
                            render={ ( { field } ) => (
                                <Switch
                                    checked={ field.value }
                                    onCheckedChange={ field.onChange }
                                    disabled={ loading }
                                />
                            ) }
                        />
                        { errors.is_preferred && (
                            <span className="text-red-500 text-sm">{ errors.is_preferred.message }</span>
                        ) }
                    </div>
                </div>
            </Drawer.Body>
            <Drawer.Footer className="border-ui-border-base flex items-center justify-end space-x-2 border-t px-6 py-4">
                <div className="flex items-center justify-end gap-x-2">
                    <Drawer.Close asChild>
                        <Button variant="secondary">Cancel</Button>
                    </Drawer.Close>
                    <Button type="submit" isLoading={ loading }>
                        { isEditing ? "Update" : "Create" }
                    </Button>
                    { error && (
                        <Text className="txt-compact-small text-ui-fg-warning">
                            Error: { error?.message }
                        </Text>
                    ) }
                </div>
            </Drawer.Footer>
        </>
    );
}