import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const query = req.scope.resolve("query");

    const { data: countries } = await query.graph({
      entity:     "countries",
      fields:     [ "iso_2", "display_name" ],
      pagination: { order: { display_name: 'ASC' } }
    });

    res.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
};
