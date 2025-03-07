import { Button, Drawer, Input, Label, Text } from "@medusajs/ui";
import { Controller } from "react-hook-form";
import { CountrySelect } from "../common/country-select.tsx";

export function VendorForm({
                             register,
                             loading,
                             error,
                             errors,
                             control,
                             countries,
                           }: {
  register: any;
  loading: boolean;
  error: Error | null;
  errors: any;
  control: any;
  countries: { iso_2: string; display_name: string }[];
}) {

  return (
    <>
      <Drawer.Body className="px-6 py-4 flex flex-1 flex-col gap-y-8 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label size="xsmall">First Name</Label>
              <Input {...register("first_name")} placeholder="John"/>
              {errors.first_name && (
                <span className="text-red-500 text-sm">
                                    {errors.first_name.message}
                                </span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label size="xsmall">Last Name</Label>
              <Input {...register("last_name")} placeholder="Doe"/>
              {errors.last_name && (
                <span className="text-red-500 text-sm">
                                    {errors.last_name.message}
                                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Label size="xsmall">Email</Label>
            <Input {...register("email")} placeholder="email@example.com"/>
            {errors.email && (
              <span className="text-red-500 text-sm">
                                {errors.email.message}
                            </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Label size="xsmall">Company Name</Label>
            <Input {...register("company_name")} placeholder="My Company LLP"/>
            {errors.company_name && (
              <span className="text-red-500 text-sm">
                                {errors.company_name.message}
                            </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Label size="xsmall">Address Line 1</Label>
            <Input {...register("address")} placeholder="1234 Main St"/>
            {errors.address && (
              <span className="text-red-500 text-sm">
                                {errors.address.message}
                            </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-x-1">
              <Label size="xsmall">Address Line 2</Label>
              <span className="font-normal font-sans txt-compact-small text-ui-fg-muted">(Optional)</span>
            </div>
            <Input
              {...register("address2")}
              placeholder="Apartment, suite, unit, etc."
            />
            {errors.address2 && (
              <span className="text-red-500 text-sm">
                                {errors.address2.message}
                            </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label size="xsmall">Postal code</Label>
              <Input {...register("postal_code")} placeholder="12345"/>
              {errors.postal_code && (
                <span className="text-red-500 text-sm">
                                    {errors.postal_code.message}
                                </span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label size="xsmall">City</Label>
              <Input {...register("city")} placeholder="1234 Main St"/>
              {errors.city && (
                <span className="text-red-500 text-sm">
                                    {errors.city.message}
                                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2">
              <Label size="xsmall">Province / State</Label>
              <Input {...register("state")} placeholder="Province / State"/>
              {errors.state && (
                <span className="text-red-500 text-sm">
                                    {errors.state.message}
                                </span>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Label size="xsmall">Country</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <CountrySelect countries={countries} placeholder="Select country"
                                 id="country" {...field} {...register("country")} />
                )}/>
              {errors.country && (
                <span className="text-red-500 text-sm">{errors.country.message}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Label size="xsmall">Phone</Label>
            <Input
              {...register("phone", {
                required: "Phone number is required",
                pattern:  {
                  value:   /^[\+]?[0-9]{1,4}?[-.●]?[0-9]{1,15}$/,
                  message: "Please enter a valid phone number",
                },
              })}
              placeholder="ex. 9876543210"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                                {errors.phone.message}
                            </span>
            )}
          </div>
        </div>
      </Drawer.Body>
      <Drawer.Footer
        className="border-ui-border-base flex items-center justify-end space-x-2 overflow-y-auto border-t px-6 py-4">
        <div className="flex items-center justify-end gap-x-2">
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button type="submit" isLoading={loading}>
            Save
          </Button>
          {error && (
            <Text className="txt-compact-small text-ui-fg-warning">
              Error: {error?.message}
            </Text>
          )}
        </div>
      </Drawer.Footer>
    </>
  );
}
