// Green Health AI agent — streams chat responses via Lovable AI Gateway
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are CropGuard Agent, a friendly plant-pathology assistant for farmers.
Help identify crop diseases from described symptoms, recommend organic and chemical treatments,
and give preventive advice. Be concise, practical, and format answers with short markdown lists
when useful. If a user asks non-farming questions, gently steer back to crops.`;

const MAX_MESSAGES = 40;
const MAX_CONTENT_CHARS = 8000;

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

    // --- Input validation ---
    const { messages, system } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "messages must be a non-empty array" }, 400);
    }
    if (messages.length > MAX_MESSAGES) {
      return json({ error: "Too many messages" }, 400);
    }

    const safeMessages = [];
    for (const m of messages) {
      if (
        !m || typeof m !== "object" ||
        !["user", "assistant"].includes(m.role) ||
        typeof m.content !== "string" ||
        m.content.length === 0 ||
        m.content.length > MAX_CONTENT_CHARS
      ) {
        return json({ error: "Invalid message format" }, 400);
      }
      safeMessages.push({ role: m.role, content: m.content });
    }

    const systemPrompt =
      typeof system === "string" && system.length > 0 && system.length <= 2000
        ? `${SYSTEM_PROMPT}\n\n${system}`
        : SYSTEM_PROMPT;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return json({ error: "AI service unavailable" }, 500);
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("AI gateway error", resp.status, text);
      const msg =
        resp.status === 429
          ? "Rate limit reached. Try again shortly."
          : resp.status === 402
          ? "AI credits exhausted."
          : "AI request failed.";
      return json({ error: msg }, resp.status);
    }

    return new Response(resp.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e) {
    console.error(e);
    return json({ error: "Unexpected error" }, 500);
  }
});
