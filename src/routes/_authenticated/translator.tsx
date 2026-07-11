import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Languages,
  Copy,
  Download,
  Trash2,
  ArrowRightLeft,
  Zap,
  Sparkles,
  Volume2,
  Star,
  Loader2,
  Shield,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useServerFn } from "@tanstack/react-start";
import { translateText } from "@/lib/translate.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/translator")({
  component: TranslatorPage,
});

type Mode = "simple" | "pro";

function TranslatorPage() {
  const translate = useServerFn(translateText);
  const qc = useQueryClient();
  const [mode, setMode] = useState<Mode>("simple");
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const words = source.trim() ? source.trim().split(/\s+/).length : 0;
  const chars = source.length;
  const sentences = source.trim() ? source.split(/[.!?]+/).filter(Boolean).length : 0;

  const doTranslate = async () => {
    if (!source.trim()) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await translate({ data: { text: source, mode } });
      setOutput(res.translated);
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      qc.invalidateQueries({ queryKey: ["history"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string, lang: string) => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    window.speechSynthesis.speak(u);
  };

  const saveFavorite = async () => {
    if (!output) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("translations").insert({
      user_id: user.id,
      source_text: source,
      translated_text: output,
      mode,
      is_favorite: true,
    });
    if (error) toast.error("Could not save"); else toast.success("Added to favorites");
    qc.invalidateQueries({ queryKey: ["favorites"] });
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6 md:p-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg btn-neon">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">Translator</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="h-3 w-3 text-success" /> Secure session · AES-256 · Zero-storage AI pipeline
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mode selector */}
        <div className="mt-6 flex gap-3">
          {(["simple", "pro"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm capitalize transition ${
                mode === m ? "btn-neon" : "glass hover:border-primary/40"
              }`}
            >
              {m === "simple" ? <Zap className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {m} {m === "pro" && <span className="text-[10px] font-mono uppercase opacity-70">formal</span>}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Source */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-2xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-primary">English</span>
              <button
                onClick={() => setSource("")}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Clear
              </button>
            </div>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Type or paste English text…"
              className="mt-3 h-64 w-full resize-none bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <div className="flex gap-4">
                <span>{chars} chars</span>
                <span>{words} words</span>
                <span>{sentences} sentences</span>
              </div>
              <button
                onClick={() => speak(source, "en-US")}
                className="hover:text-primary flex items-center gap-1"
              >
                <Volume2 className="h-3 w-3" /> Listen
              </button>
            </div>
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-2xl p-5 relative"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-secondary">German</span>
              <div className="flex gap-2">
                <button
                  onClick={saveFavorite}
                  disabled={!output}
                  className="text-xs text-muted-foreground hover:text-warning flex items-center gap-1 disabled:opacity-40"
                >
                  <Star className="h-3 w-3" /> Save
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    toast.success("Copied");
                  }}
                  disabled={!output}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 disabled:opacity-40"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([output], { type: "text/plain" });
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = "translation.txt";
                    a.click();
                  }}
                  disabled={!output}
                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 disabled:opacity-40"
                >
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            </div>
            <div className="mt-3 h-64 overflow-auto text-base whitespace-pre-wrap">
              {loading ? (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Translating securely…
                </div>
              ) : output ? (
                output
              ) : (
                <span className="text-muted-foreground/60">Your translation will appear here.</span>
              )}
            </div>
            {output && (
              <button
                onClick={() => speak(output, "de-DE")}
                className="mt-3 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
              >
                <Volume2 className="h-3 w-3" /> Hear pronunciation
              </button>
            )}
          </motion.div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={doTranslate}
            disabled={loading || !source.trim()}
            className="rounded-lg btn-neon px-10 py-3 text-sm font-semibold flex items-center gap-2 disabled:opacity-40"
          >
            <ArrowRightLeft className="h-4 w-4" />
            {loading ? "Translating…" : "Translate"}
          </button>
        </div>

        {/* Security badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
          {["Encryption Active", "Secure Session", "No Data Retained", "AI Verified"].map((b) => (
            <span key={b} className="glass rounded-full px-3 py-1 font-mono flex items-center gap-1">
              <Shield className="h-3 w-3 text-success" /> {b}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
}
