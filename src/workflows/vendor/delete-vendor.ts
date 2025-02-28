import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { VENDOR_MODULE } from "../../modules/vendor"
import VendorModuleService from "../../modules/vendor/service"

type ModuleDeleteVendor = {
    id: string
  }
export const deleteBrandStep = createStep(
    "delete-vendor",
    async (ids: string, { container }) => {
        const vendorModuleService: VendorModuleService = container.resolve(
          VENDOR_MODULE
        )
        // await vendorModuleService.softDeleteVendors(ids)
        await vendorModuleService.deleteVendors(ids)
        return new StepResponse(ids, ids)
      },
        async (ids: string, { container }) => {
            const vendorModuleService: VendorModuleService = container.resolve(
                VENDOR_MODULE
            )
            await vendorModuleService.restoreVendors(ids)
        }
)

export const deleteVendorWorkflow = createWorkflow(
    "delete-vendor",
    (input: ModuleDeleteVendor) => {
        deleteBrandStep(input.id)
        return new WorkflowResponse(undefined);
    }
)   