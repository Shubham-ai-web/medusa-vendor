import { Drawer, toast } from "@medusajs/ui";
import { useUpdateVendor } from "../../hooks/vendor";
import { VendorForm } from "./vendor-form";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useCountries } from "../../hooks/countries";

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

export function VendorUpdateDrawer( {
                                        vendor,
                                        refetch,
                                        open,
                                        setOpen,
                                    }: {
    vendor: any;
    refetch: () => void;
    open: boolean;
    setOpen: ( open: boolean ) => void;
} ) {
    const { mutate, loading, error } = useUpdateVendor( vendor.id );
    const {
        data: countriesData,
        loading: countriesLoading,
        error: countriesError,
    } = useCountries();
    const countries = countriesData?.countries || [];

    const { ...currentData } = vendor;

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
        defaultValues: currentData || {
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

    useEffect( () => {
        if ( vendor ) {
            reset( vendor );
        }
    }, [ vendor, reset ] );

    const onSubmit = async ( formData: any ) => {
        const sanitizedData = {
            ...formData,
            address2: formData.address2 ?? "",
        };
        await mutate( sanitizedData ).then( () => {
            setOpen( false );
            reset( sanitizedData );
            clearErrors();
            refetch();
            toast.success( `Vendor "${ formData.company_name }" updated successfully` );
        } );
    };

    return (
        <Drawer open={ open } onOpenChange={ setOpen }>
            <Drawer.Content>
                <Drawer.Header>
                    <Drawer.Title>Edit Vendor</Drawer.Title>
                </Drawer.Header>
                <form
                    onSubmit={ handleSubmit( onSubmit ) }
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <VendorForm
                        loading={ loading || countriesLoading }
                        error={ error || countriesError }
                        register={ register }
                        control={ control }
                        errors={ errors }
                        countries={ countries }
                    />
                </form>
            </Drawer.Content>
        </Drawer>
    );
}
