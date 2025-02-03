import { useEffect, useState } from "react";
import { sdk } from "../lib/sdk";

export const useVendors = (
  query?: Record<string, any>
): {
  data: any | null;
  refetch: () => void;
  loading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const filterQuery = new URLSearchParams(query).toString();

  const refetch = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const result: any = await sdk.client.fetch(
          "/admin/vendors" + (filterQuery ? `?${filterQuery}` : ""),
          {
            method: "GET",
          }
        );

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [refetchTrigger]);

  return { data, refetch, loading, error };
};

export const useCreateVendor = (): {
  mutate: (vendor: any) => Promise<any>;
  loading: boolean;
  error: Error | null;
} => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (vendor: any) => {
    setLoading(true);
    setError(null);

    try {
      const result: any = await sdk.client.fetch("/admin/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: vendor,
      });

      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

export const useDeleteVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await sdk.client.fetch(`/admin/vendors?id=${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

export const useUpdateVendor = (
  vendorId: string
): {
  mutate: (vendor: any) => Promise<any>;
  loading: boolean;
  error: Error | null;
} => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (vendor: any) => {
    setLoading(true);
    setError(null);

    try {
      const result: any = await sdk.client.fetch(`/admin/vendors/${vendorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: vendor,
      });

      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
