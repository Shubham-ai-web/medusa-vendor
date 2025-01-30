import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { emitEventStep } from "@medusajs/medusa/core-flows";
import { VENDOR_MODULE } from "src/modules/vendor";
import VendorModuleService from "src/modules/vendor/service";

export type CreateVendorInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
};

type CreateVendorWorkflowInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
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
