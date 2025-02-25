import { MedusaContainer } from "@medusajs/framework/types"
import { sendLowstockNotificationsWorkflow } from "src/workflows/send-lowstock-notifications"

export default async function myCustomJob(container: MedusaContainer) {
    await sendLowstockNotificationsWorkflow(container)
      .run()
  }
  
  export const config = {
    name: "check-lowstock",
    schedule: "* * * * *", // For debugging, change to `* * * * *`
  }