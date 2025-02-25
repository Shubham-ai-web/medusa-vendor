import { Module } from "@medusajs/framework/utils"
import LowstockModuleService from "./service"

export const LOWSTOCK_MODULE = "lowstock"

export default Module(LOWSTOCK_MODULE, {
  service: LowstockModuleService,
})