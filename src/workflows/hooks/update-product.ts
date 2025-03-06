import { createProductsWorkflow, updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";
import { VENDOR_MODULE } from "../../modules/vendor";
import VendorModuleService from "../../modules/vendor/service";

updateProductsWorkflow.hooks.productsUpdated(
  async ({ products, additional_data }, { container }) => {
    const vendor_id = additional_data?.vendor_id;
    if (!vendor_id) return;

    const link = container.resolve("link");
    const logger = container.resolve("logger");
    const vendorModuleService: VendorModuleService = container.resolve(VENDOR_MODULE);

    try {
      await vendorModuleService.retrieveVendor(vendor_id as string);

      const links: LinkDefinition[] = products.map((product) => ({
        [Modules.PRODUCT]: { product_id: product.id },
        [VENDOR_MODULE]:   { vendor_id },
      }));

      await link.create(links);
      logger.info("Linked vendor to products");

      return new StepResponse(links, links);
    } catch (error) {
      logger.error("Error linking vendor to products:", error);
      throw new Error("Failed to link vendor to products");
    }
  },
  async (links, { container }) => {
    if (!links?.length) return;

    const link = container.resolve("link");
    await link.dismiss(links);
  }
);
  