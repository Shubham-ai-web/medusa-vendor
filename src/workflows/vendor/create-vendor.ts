import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { emitEventStep } from "@medusajs/medusa/core-flows";
import { VENDOR_MODULE } from "../../modules/vendor";
import VendorModuleService from "../../modules/vendor/service";

export type CreateVendorInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  company_name?: string;
  tax_id?: string;
};

type CreateVendorWorkflowInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  company_name?: string;
  tax_id?: string;
};
export const createVendorStep = createStep(
  "create-vendor-step",
  async (input: CreateVendorInput, { container }) => {
    const vendorModuleService: VendorModuleService =
      container.resolve(VENDOR_MODULE);

    const vendor = await vendorModuleService.createVendors(input);

    return new StepResponse(vendor, vendor.id);
  },
  async (id: string, { container }) => {
    const vendorModuleService: VendorModuleService =
      container.resolve(VENDOR_MODULE);

    await vendorModuleService.deleteVendors(id);
  }
);

export const createVendorWorkflow = createWorkflow(
  "create-vendor",
  (input: CreateVendorWorkflowInput) => {
    const vendor = createVendorStep(input);
    emitEventStep({
      eventName: "vendor.created",
      data: {
        id: vendor.id,
      },
    });

    return new WorkflowResponse(vendor);
  }
);
