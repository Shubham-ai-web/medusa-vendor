import { useState } from "react";
import { sdk } from "../lib/sdk";

export const useUpdateProductVendor = (): {
  mutate: (vendor: any) => Promise<any>;
  mutateDelete: (vendor: any) => Promise<any>;
  loading: boolean;
  error: Error | null;
} => {
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<Error | null>(null);

  interface VendorInput {
    product_id: string;
    vendor_id: string;
  }

  interface ProductResponse {
    id: string;
    additional_data: {
      vendor_id: string;
    };
  }

  const mutate = async (vendor: VendorInput): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await sdk.client.fetch<ProductResponse>(
        `/admin/products/${vendor.product_id}`,
        {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:    {
            additional_data: {
              vendor_id: vendor.vendor_id,
            },
          },
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const mutateDelete = async (vendor: VendorInput): Promise<ProductResponse> => {
    setLoading(true);
    setError(null);

    try {
      return await sdk.client.fetch<ProductResponse>(
        `/admin/products/${vendor.product_id}`,
        {
          method:  "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body:    {
            additional_data: {
              vendor_id: vendor.vendor_id,
            },
          },
        }
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, mutateDelete, loading, error };
};


export const useRemoveProductVendor = () => {
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<Error | null>(null);

  const removeVendor = async (productId: string, vendorId: string) => {
    setLoading(true);
    setError(null);

    try {
      return await sdk.client.fetch(
        `/admin/products/${productId}/vendors/${vendorId}`,
        {
          method:  "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removeVendor, loading, error };
};