import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Bot, Leaf, Bug, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import leafMacro from "@/assets/leaf-macro.jpg";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  { icon: Leaf, text: "My tomato leaves have yellow spots with brown centers — what disease is it?" },
  { icon: Bug, text: "How do I organically treat aphids on my chili plants?" },
  { icon: Droplets, text: "Best watering schedule to prevent powdery mildew?" },
];

const AGENTS = [
  { id: "pathologist", name: "Plant Pathologist", desc: "Disease identification" },
  { id: "agronomist", name: "Field Agronomist", desc: "Treatment & spray plans" },
  { id: "entomologist", name: "Pest Entomologist", desc: "Insect & pest control" },
  { id: "soil", name: "Soil & Nutrition", desc: "Deficiency diagnosis" },
];

const AgentSection = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [agent, setAgent] = useState(AGENTS[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;
    const agentMeta = AGENTS.find((a) => a.id === agent);
    const framed = `[You are acting as the ${agentMeta?.name} — ${agentMeta?.desc}.]\n${text}`;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Please sign in to use the agents.");
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-agent`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [...next.slice(0, -1), { role: "user", content: framed }],
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("Agent unavailable");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const l = line.trim();
          if (!l.startsWith("data:")) continue;
          const payload = l.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const c = [...m];
                c[c.length - 1] = { role: "assistant", content: assistant };
                return c;
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "Agent error");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="agents" className="max-w-7xl mx-auto px-6 py-24 border-b border-foreground/10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-4 mb-14">
        <div>
          <p className="eyebrow text-primary mb-4">Section II · Multi-Agent Console</p>
          <h2 className="text-5xl md:text-7xl font-serif leading-[0.9] max-w-3xl">
            Talk to a team of <span className="italic">specialist agents.</span>
          </h2>
        </div>
        <p className="eyebrow text-muted-foreground max-w-xs">
          Pathologist · Agronomist · Entomologist · Soil expert — powered by Gemini.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: editorial image + agent picker */}
        <aside className="lg:col-span-4 space-y-6">
          <figure className="relative aspect-[4/5] overflow-hidden border border-foreground/10">
            <img
              src={leafMacro}
              alt="Macro of a healthy leaf with dew"
              className="w-full h-full object-cover grayscale-[0.1]"
              loading="lazy"
              width={1600}
              height={1000}
            />
            <figcaption className="absolute bottom-4 left-4 right-4 text-foreground eyebrow">
              Fig. 02 · Specialist consultation
            </figcaption>
          </figure>

          <div className="space-y-1">
            <p className="eyebrow text-muted-foreground mb-3">Select an agent</p>
            {AGENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAgent(a.id)}
                className={`w-full text-left border p-4 transition-colors ${
                  agent === a.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/15 hover:border-foreground/40"
                }`}
              >
                <p className="font-serif text-lg leading-tight">{a.name}</p>
                <p className="eyebrow opacity-60 mt-1">{a.desc}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Right: chat surface */}
        <div className="lg:col-span-8 border border-foreground/15 bg-secondary/40 flex flex-col min-h-[620px]">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-foreground/10 bg-background">
            <Bot className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="eyebrow opacity-60">Live session</p>
              <p className="font-serif text-lg italic leading-none">
                {AGENTS.find((a) => a.id === agent)?.name}
              </p>
            </div>
            <span className="hidden sm:flex items-center gap-1.5 eyebrow text-primary">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" /> Online
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div>
                <p className="eyebrow text-muted-foreground mb-4">Try a starter question</p>
                <div className="space-y-2">
                  {SUGGESTIONS.map(({ icon: Icon, text }) => (
                    <button
                      key={text}
                      onClick={() => send(text)}
                      className="w-full text-left flex items-start gap-3 border border-foreground/15 bg-background px-4 py-3 hover:border-foreground/50 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{text}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-6 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-accent" /> Free to chat · scans still cost 10 credits
                </p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "ml-auto max-w-[85%] bg-primary text-primary-foreground px-4 py-3"
                      : "mr-auto max-w-[90%] bg-background border border-foreground/15 px-4 py-3"
                  }`}
                >
                  {m.content || (loading ? "…" : "")}
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 p-4 border-t border-foreground/10 bg-background"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe symptoms, ask about pests, treatments…"
              className="flex-1 bg-secondary/60 px-4 py-3 text-sm outline-none border border-transparent focus:border-foreground/30"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground p-3 hover:bg-primary/85 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AgentSection;
