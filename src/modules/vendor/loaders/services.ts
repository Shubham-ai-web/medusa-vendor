import { LoaderOptions } from "@medusajs/framework/types"
import { asClass, asValue } from "awilix"
import VendorInventoryService from "../service"
import { MikroOrmBaseRepository } from "@medusajs/framework/utils"

export default async function servicesLoader({ container }: LoaderOptions) {
  const baseRepository = new MikroOrmBaseRepository({ container })

  container.register({
    baseRepository:         asValue(baseRepository),
    vendorInventoryService: asClass(VendorInventoryService)/*.singleton()*/,
  })
} 