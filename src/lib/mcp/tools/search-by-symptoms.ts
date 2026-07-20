import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { diseases, symptoms } from "../../../data/diseases";

export default defineTool({
  name: "search_diseases_by_symptoms",
  title: "Diagnose by symptoms",
  description:
    "Given a list of observed symptoms, return likely crop diseases ranked by how many symptoms match. Use one or more of the supported symptom labels.",
  inputSchema: {
    symptoms: z
      .array(z.string())
      .min(1)
      .describe(
        `List of observed symptoms. Supported labels: ${symptoms.join(", ")}. Free-form text is matched case-insensitively.`,
      ),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ symptoms: input }) => {
    const lower = input.map((s) => s.toLowerCase().trim());
    const scored = diseases
      .map((d) => {
        const matches = d.symptoms.filter((s) =>
          lower.some((q) => s.toLowerCase().includes(q) || q.includes(s.toLowerCase())),
        );
        return { disease: d, matchCount: matches.length, matchedSymptoms: matches };
      })
      .filter((r) => r.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);

    return {
      content: [
        {
          type: "text",
          text:
            scored.length === 0
              ? "No matching diseases found for those symptoms."
              : JSON.stringify(scored, null, 2),
        },
      ],
      structuredContent: { results: scored },
    };
  },
});
