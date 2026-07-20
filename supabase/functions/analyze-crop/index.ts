// Analyze crop image with Lovable AI (Gemini vision) and return diagnosis
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image } = await req.json();
    if (!image || typeof image !== "string") {
      return new Response(JSON.stringify({ error: "Missing image (data URL)" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = {
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a plant pathologist. Analyze crop images and identify diseases. Always respond by calling the report_diagnosis tool.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this crop specimen and provide a diagnosis." },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "report_diagnosis",
            description: "Report the crop disease diagnosis.",
            parameters: {
              type: "object",
              properties: {
                crop: { type: "string", description: "Identified crop (e.g. Tomato, Wheat)" },
                disease: { type: "string", description: "Most likely disease or 'Healthy'" },
                confidence: { type: "number", description: "0-1 confidence score" },
                severity: { type: "string", enum: ["low", "medium", "high", "none"] },
                symptoms: { type: "array", items: { type: "string" } },
                treatment: { type: "array", items: { type: "string" } },
                prevention: { type: "array", items: { type: "string" } },
                summary: { type: "string" },
              },
              required: ["crop", "disease", "confidence", "severity", "symptoms", "treatment", "prevention", "summary"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "report_diagnosis" } },
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error", resp.status, text);
      const msg =
        resp.status === 429
          ? "Rate limit reached. Please try again shortly."
          : resp.status === 402
          ? "AI credits exhausted. Add credits in workspace billing."
          : "AI analysis failed.";
      return new Response(JSON.stringify({ error: msg, status: resp.status }), {
        status: resp.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return new Response(JSON.stringify({ error: "No diagnosis returned" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const diagnosis = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
