import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { diseases } from "../../../data/diseases";

export default defineTool({
  name: "list_diseases",
  title: "List crop diseases",
  description:
    "Return the full CropGuard almanac of crop diseases with symptoms, treatment, prevention, and severity.",
  inputSchema: {
    crop: z
      .string()
      .optional()
      .describe("Optional case-insensitive substring filter matched against the disease's crop field."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ crop }) => {
    const filtered = crop
      ? diseases.filter((d) => d.crop.toLowerCase().includes(crop.toLowerCase()))
      : diseases;
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { count: filtered.length, diseases: filtered },
    };
  },
});
