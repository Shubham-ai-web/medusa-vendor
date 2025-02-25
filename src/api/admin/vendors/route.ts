import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { z } from "zod";
import { PostAdminCreateVendor } from "./validators";
import {
  createVendorWorkflow,
  deleteVendorWorkflow,
} from "src/workflows/vendor";

type PostAdminCreateVendorType = z.infer<typeof PostAdminCreateVendor>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateVendorType>,
  res: MedusaResponse
) => {
  try {
    const { result } = await createVendorWorkflow(req.scope).run({
      input: {
        ...req.validatedBody,
        phone: req.validatedBody.phone || "",
      },
    });

    res.json({ vendor: result });
  } catch (error) {
    console.error("Error creating vendor:", error);
    res.status(500).json({ error: "Failed to create vendor" });
  }
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve("query");

    const { data: vendors, metadata } = await query.graph({
      entity: "vendor", 
      ...req.queryConfig,
      fields: [...(req.queryConfig?.fields || []), "*", "products.*"],
    });

    const count = metadata?.count ?? 0;
    const take = metadata?.take ?? 20;
    const skip = metadata?.skip ?? 0;

    res.json({ vendors, count, limit: take, offset: skip });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ error: "Failed to fetch vendor" });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    await deleteVendorWorkflow.run({
      input: { id },
    });
    res.status(200).json({
      id,
      object: "vendor",
      deleted: true,
    });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ error: "Failed to delete vendor" });
  }
};
