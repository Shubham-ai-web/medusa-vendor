import { useQuery } from "@tanstack/react-query"
import { sdk } from "../lib/sdk"

type Vendor = {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
  phone: string;
  address: string;
}

type VendorsResponse = {
  vendors: Vendor[]
}

export const useAdminVendors = () => {
  return useQuery<VendorsResponse>({
    queryKey: [["vendors"]],
    queryFn: () => sdk.client.fetch(`/admin/vendors`, {}),
  })
} 