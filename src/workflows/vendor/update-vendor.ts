import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { VENDOR_MODULE } from "src/modules/vendor";
import VendorModuleService from "src/modules/vendor/service";

export const updateVendorStep = createStep(
  "update-vendor",
  async (input: any, { container }) => {
    const vendorModuleService: VendorModuleService =
      container.resolve(VENDOR_MODULE);
    const prevData = await vendorModuleService.retrieveVendor(input.id);
    const updatedVendors = await vendorModuleService.updateVendors(input);
    return new StepResponse(updatedVendors, prevData);
  },
  async (prevData, { container }) => {
    const vendorModuleService: VendorModuleService =
      container.resolve(VENDOR_MODULE);
    await vendorModuleService.updateVendors(prevData);
  }
);

export const updateVendorWorkflow = createWorkflow(
  "update-vendor",
  (input: any) => {
    const updatedVendors = updateVendorStep(input);
    return new WorkflowResponse(updatedVendors);
  }
);
