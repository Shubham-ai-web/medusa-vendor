import { InjectManager, MedusaContext, MedusaService } from "@medusajs/framework/utils"
import LowstockSubscription from "./models/lowstock-subscription"
import { EntityManager } from "@mikro-orm/knex"
import { Context } from "@medusajs/framework/types"


class LowstockModuleService extends MedusaService({
  LowstockSubscription,
}) {
    @InjectManager()
    async getUniqueSubscriptions(
      @MedusaContext() context: Context<EntityManager> = {}
    ) {
      return await context.manager?.createQueryBuilder("lowstock_subscription")
        .select(["variant_id", "sales_channel_id"]).distinct().execute()
    }
  
 }

export default LowstockModuleService