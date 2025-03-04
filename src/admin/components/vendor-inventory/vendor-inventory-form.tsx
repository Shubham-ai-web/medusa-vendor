import { Button, Drawer, Input, Label, Select, Switch, Text } from "@medusajs/ui";
import { Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";

type FormValues = {
    vendor: string;
    price: number | null;
    turnaround_days: number | null;
    is_preferred: boolean;
};

interface VendorInventoryFormProps {
    register: UseFormRegister<FormValues>;
    loading: boolean;
    error: Error | null;
    errors: FieldErrors<FormValues>;
    control: Control<FormValues>;
    vendors: { id: string; company_name: string; email: string }[];
    isEditing?: boolean;
}

export function VendorInventoryForm({
    register,
    loading,
    error,
    errors,
    control,
    vendors,
    isEditing = false,
}: VendorInventoryFormProps) {
    return (
        <>
            <Drawer.Body className="px-6 py-4 flex flex-1 flex-col gap-y-8 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {!isEditing && (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="vendor" size="xsmall">
                                Vendor
                            </Label>
                            <Controller
                                name="vendor"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={loading || vendors.length === 0}
                                    >
                                        <Select.Trigger id="vendor">
                                            <Select.Value
                                                placeholder={vendors.length === 0 ? "No vendors available" : "Select a vendor"}
                                            />
                                        </Select.Trigger>
                                        <Select.Content>
                                            {vendors.length > 0 &&
                                                vendors.map((vendor) => (
                                                    <Select.Item key={vendor.id} value={vendor.id}>
                                                        {`${vendor.company_name} <${vendor.email}>`}
                                                    </Select.Item>
                                                ))}
                                        </Select.Content>
                                    </Select>
                                )}
                            />
                            {errors.vendor && (
                                <span className="text-red-500 text-sm">{errors.vendor.message}</span>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="price" size="xsmall">
                            Price
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            disabled={loading}
                            {...register("price", {
                                required: "Price is required",
                                valueAsNumber: true,
                                min: { value: 0, message: "Price must be non-negative" },
                            })}
                        />
                        {errors.price && (
                            <span className="text-red-500 text-sm">{errors.price.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="turnaround_days" size="xsmall">
                            Turnaround Days
                        </Label>
                        <Input
                            id="turnaround_days"
                            type="number"
                            placeholder="1"
                            disabled={loading}
                            {...register("turnaround_days", {
                                required: "Turnaround days is required",
                                valueAsNumber: true,
                                min: { value: 1, message: "Turnaround days must be at least 1" },
                            })}
                        />
                        {errors.turnaround_days && (
                            <span className="text-red-500 text-sm">{errors.turnaround_days.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="is_preferred" size="xsmall">
                            Preferred Vendor
                        </Label>
                        <Controller
                            name="is_preferred"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    id="is_preferred"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={loading}
                                />
                            )}
                        />
                    </div>
                </div>
            </Drawer.Body>
            <Drawer.Footer className="border-ui-border-base flex items-center justify-end space-x-2 border-t px-6 py-4">
                <Drawer.Close asChild>
                    <Button variant="secondary" disabled={loading}>
                        Cancel
                    </Button>
                </Drawer.Close>
                <Button type="submit" isLoading={loading}>
                    {isEditing ? "Update" : "Create"}
                </Button>
                {error && (
                    <Text className="txt-compact-small text-ui-fg-error">
                        Error: {error.message}
                    </Text>
                )}
            </Drawer.Footer>
        </>
    );
}