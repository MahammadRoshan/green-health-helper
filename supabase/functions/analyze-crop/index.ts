// Analyze crop image with Lovable AI (Gemini vision) and return diagnosis
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCAN_COST = 10;
const MAX_IMAGE_CHARS = 8_000_000; // ~6MB binary as data URL

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // --- Authentication ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userId = claimsData.claims.sub as string;

    // --- Input validation ---
    const { image } = await req.json();
    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return json({ error: "Missing or invalid image (data URL)" }, 400);
    }
    if (image.length > MAX_IMAGE_CHARS) {
      return json({ error: "Image too large" }, 413);
    }

    // --- Server-side credit / subscription enforcement (before AI call) ---
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_subscribed, credits")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || !profile) {
      console.error("profile lookup failed", profileError);
      return json({ error: "Unable to verify account" }, 403);
    }

    const isSubscribed = !!profile.is_subscribed;
    if (!isSubscribed) {
      const { error: deductError } = await supabase.rpc("deduct_credits", { amount: SCAN_COST });
      if (deductError) {
        console.error("deduct_credits failed", deductError);
        return json({ error: "Insufficient credits. Subscribe for unlimited scans." }, 402);
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return json({ error: "AI service unavailable" }, 500);
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
      return json({ error: msg }, resp.status);
    }

    const data = await resp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) {
      return json({ error: "No diagnosis returned" }, 502);
    }

    const diagnosis = JSON.parse(call.function.arguments);
    return json({ diagnosis, creditsCharged: isSubscribed ? 0 : SCAN_COST });
  } catch (e) {
    console.error(e);
    return json({ error: "Unexpected error" }, 500);
  }
});
