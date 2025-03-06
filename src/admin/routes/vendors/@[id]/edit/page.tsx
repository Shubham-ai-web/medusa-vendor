import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { VendorUpdateDrawer } from "../../../../components/vendors/vendor-update-drawer";
import { Vendor } from "../../../../components/vendor-inventory/types";


interface OutletContext {
  vendors: Vendor[];
  refetch: () => void;
  countriesData: any;
  countriesLoading: boolean;
  countriesError: any;
}

const VendorEditPage = () => {
  const navigate = useNavigate();
  const { vendors, refetch, countriesData, countriesLoading, countriesError } = useOutletContext<OutletContext>();

  const { id } = useParams<{ id: string }>();

  const vendor = vendors.find(v => v.id === id);

  if (!vendor) {
    return <div>Vendor not found</div>;
  }

  const handleClose = () => {
    navigate("/vendors");
  };

  return (
    <VendorUpdateDrawer
      vendor={vendor}
      refetch={refetch}
      open={true}
      setOpen={(open) => !open && handleClose()}
      countriesData={countriesData}
      countriesLoading={countriesLoading}
      countriesError={countriesError}
    />
  );
};

export default VendorEditPage;