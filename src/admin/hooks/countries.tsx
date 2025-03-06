import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

export const useCountries = ( query?: Record<string, any> ) => {
    const filterQuery = new URLSearchParams( query ).toString();

    const { data, isLoading: loading, error, refetch } = useQuery( {
        queryKey: [ "countries", filterQuery ],
        queryFn: () => sdk.client.fetch<any>( `/admin/countries${ filterQuery ? `?${ filterQuery }` : "" }`, { method: "GET" } ),
    } );

    return {
        data,
        refetch,
        loading,
        error,
    };
};