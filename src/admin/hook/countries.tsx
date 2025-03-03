import { useEffect, useState } from "react";
import { sdk } from "../lib/sdk";

export const useCountries = (
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
    const fetchCountries = async () => {
        setLoading(true);
      try {
        const result: any = await sdk.client.fetch(
          "/admin/countries" + (filterQuery ? `?${filterQuery}` : ""),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
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

    fetchCountries();
  }, [refetchTrigger, filterQuery]);

  return { data, refetch, loading, error };
};