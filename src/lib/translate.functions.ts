import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const TranslateInput = z.object({
  text: z.string().min(1).max(5000),
  mode: z.enum(["simple", "pro"]),
});

export const translateText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TranslateInput.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service not configured");

    const systemPrompt =
      data.mode === "pro"
        ? "You are a professional English-to-German translator specializing in business, legal, and technical writing. Translate the user's text into formal, polished, native-quality German. Preserve meaning, improve grammar and style, and use formal 'Sie' where appropriate. Return ONLY the German translation with no commentary, no quotes, no prefixes."
        : "You are an English-to-German translator. Translate the user's text into natural, everyday German. Return ONLY the German translation with no commentary, no quotes, no prefixes.";

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "raw",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: data.text },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please slow down.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits.");
      throw new Error(`Translation failed: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const translated: string = json.choices?.[0]?.message?.content?.trim() ?? "";

    // Save to history
    await context.supabase.from("translations").insert({
      user_id: context.userId,
      source_text: data.text,
      translated_text: translated,
      mode: data.mode,
    });

    return { translated };
  });
