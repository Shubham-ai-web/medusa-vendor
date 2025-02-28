import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";
import { VENDOR_MODULE } from "../../modules/vendor";
import VendorModuleService from "../../modules/vendor/service";

createProductsWorkflow.hooks.productsCreated(
  async ({ products, additional_data }, { container }) => {
    if (additional_data?.vendor_id) {
      const link = container.resolve("link");
      const logger = container.resolve("logger");

      const links: LinkDefinition[] = [];

      for (const product of products) {
        links.push({
          [Modules.PRODUCT]: {
            product_id: product.id,
          },
          [VENDOR_MODULE]: {
            vendor_id: additional_data.vendor_id,
          },
        });
      }

      await link.create(links);

      logger.info("Linked vendor to products");

      return new StepResponse(links, links);
    }

    const vendorModuleService: VendorModuleService =
      container.resolve(VENDOR_MODULE);

    if (additional_data?.vendor_id) {
      await vendorModuleService.retrieveVendor(
        additional_data.vendor_id as string
      );
    }
  },
  async (links, { container }) => {
    if (!links?.length) {
      return;
    }

    const link = container.resolve("link");

    await link.dismiss(links);
  }
);
