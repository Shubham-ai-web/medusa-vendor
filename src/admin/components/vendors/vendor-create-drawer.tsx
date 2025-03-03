import { Button, Drawer, toast } from "@medusajs/ui";
import { useState } from "react";
import { useCreateVendor } from "../../hook/vendor";
import { VendorForm } from "./vendor-form";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCountries } from "../../hook/countries";

const schema = zod.object( {
    first_name: zod.string().min( 2, "First name is required" ),
    last_name: zod.string().min( 2, "Last name is required" ),
    email: zod.string().email( "Invalid email address" ),
    company_name: zod.string().min( 2, "Company name is required" ),
    address: zod.string().min( 2, "Address line 1 is required" ),
    address2: zod
        .string()
        .nullable()
        .transform( ( val ) => val ?? "" ),
    city: zod.string().min( 2, "City is required" ),
    postal_code: zod.string().min( 2, "Postal code is required" ),
    state: zod.string().min( 2, "State is required" ),
    country: zod.string().min( 2, "Country is required" ),
    phone: zod.string().min( 2, "Phone is required" ),
} );

export function VendorCreateDrawer( { refetch }: { refetch: () => void } ) {
    const [ open, setOpen ] = useState( false );

    const { mutate, loading, error } = useCreateVendor();
    const {
        data: countriesData,
        loading: countriesLoading,
        error: countriesError,
    } = useCountries();
    const countries = countriesData?.countries || [];

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
        setValue: _1,
        watch: _2,
        clearErrors,
        control,
    } = useForm( {
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            company_name: "",
            address: "",
            address2: "",
            city: "",
            postal_code: "",
            state: "",
            country: "",
            phone: "",
        },
        resolver: zodResolver( schema ),
    } );

    const onSubmit = async ( formData: any ) => {
        const sanitizedData = {
            ...formData,
            address2: formData.address2 ?? "",
        };
        await mutate( sanitizedData ).then( () => setOpen( false ) );
        reset();
        clearErrors();
        refetch();
        toast.success( `Vendor "${ formData.company_name }" created successfully` );
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset(); 
        }
      };
    return (
        <Drawer open={ open } onOpenChange={ handleOpenChange }>
            <Drawer.Trigger asChild>
                <Button variant="secondary" size="small">
                    Create
                </Button>
            </Drawer.Trigger>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Create Company</Drawer.Title>
                </Drawer.Header>
                <form
                    onSubmit={ handleSubmit( onSubmit ) }
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <VendorForm
                        loading={ loading || countriesLoading }
                        error={ error || countriesError }
                        register={ register }
                        errors={ errors }
                        control={ control }
                        countries={ countries }
                    />
                </form>
            </Drawer.Content>
        </Drawer>
    );
}
