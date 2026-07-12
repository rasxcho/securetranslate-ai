import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Timer,
  AlertTriangle,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useServerFn } from "@tanstack/react-start";
import { translateText } from "@/lib/translate.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { detectAndMask, unmask, type PiiMatch } from "@/lib/pii";
import {
  encryptText,
  decryptText,
  generateSessionKey,
  fingerprintKey,
  type EncryptedBlob,
} from "@/lib/session-crypto";

export const Route = createFileRoute("/_authenticated/translator")({
  component: TranslatorPage,
});

type Mode = "simple" | "pro" | "confidential";

const MODES: Array<{
  key: Mode;
  label: string;
  icon: typeof Zap;
  tag: string;
  desc: string;
}> = [
  { key: "simple", label: "Simple", icon: Zap, tag: "everyday", desc: "Fast, natural translation" },
  { key: "pro", label: "Pro", icon: Sparkles, tag: "formal", desc: "Business & technical polish" },
  {
    key: "confidential",
    label: "Confidential",
    icon: Lock,
    tag: "zero-trust",
    desc: "PII masking · AES-256 · auto-wipe",
  },
];

const AUTO_WIPE_SECONDS = 60;

function TranslatorPage() {
  const translate = useServerFn(translateText);
  const qc = useQueryClient();
  const [mode, setMode] = useState<Mode>("simple");
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Confidential-mode state
  const [sessionKey, setSessionKey] = useState<CryptoKey | null>(null);
  const [keyFp, setKeyFp] = useState<string>("");
  const [encSource, setEncSource] = useState<EncryptedBlob | null>(null);
  const [encOutput, setEncOutput] = useState<EncryptedBlob | null>(null);
  const [detected, setDetected] = useState<PiiMatch[]>([]);
  const [reveal, setReveal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const wipeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const isConfidential = mode === "confidential";

  // Provision a session key when Confidential mode is entered.
  useEffect(() => {
    if (!isConfidential) return;
    let cancelled = false;
    (async () => {
      const k = await generateSessionKey();
      const fp = await fingerprintKey(k);
      if (cancelled) return;
      setSessionKey(k);
      setKeyFp(fp);
    })();
    return () => {
      cancelled = true;
    };
  }, [isConfidential]);

  // Live PII preview
  const preview = useMemo(() => {
    if (!isConfidential || !source.trim()) return { masked: "", matches: [] as PiiMatch[] };
    return detectAndMask(source);
  }, [source, isConfidential]);

  const words = source.trim() ? source.trim().split(/\s+/).length : 0;
  const chars = source.length;
  const sentences = source.trim() ? source.split(/[.!?]+/).filter(Boolean).length : 0;

  const wipeSession = () => {
    setSource("");
    setOutput("");
    setEncSource(null);
    setEncOutput(null);
    setDetected([]);
    setReveal(false);
    setCountdown(null);
    if (wipeTimer.current) clearInterval(wipeTimer.current);
    wipeTimer.current = null;
  };

  const startCountdown = () => {
    setCountdown(AUTO_WIPE_SECONDS);
    if (wipeTimer.current) clearInterval(wipeTimer.current);
    wipeTimer.current = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return null;
        if (c <= 1) {
          wipeSession();
          toast.success("Confidential session auto-wiped");
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => () => {
    if (wipeTimer.current) clearInterval(wipeTimer.current);
  }, []);

  // Clear countdown & buffers when leaving Confidential mode
  useEffect(() => {
    if (!isConfidential) wipeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfidential]);

  const doTranslate = async () => {
    if (!source.trim()) return;
    setLoading(true);
    setOutput("");
    setEncOutput(null);
    try {
      if (isConfidential) {
        if (!sessionKey) throw new Error("Session key not ready");
        const { masked, matches } = detectAndMask(source);
        setDetected(matches);
        // Encrypt source at rest (in-memory only)
        const encS = await encryptText(sessionKey, source);
        setEncSource(encS);

        const res = await translate({
          data: { text: masked, mode: "confidential", ephemeral: true },
        });
        const restored = unmask(res.translated, matches);
        const encO = await encryptText(sessionKey, restored);
        setEncOutput(encO);
        setOutput(restored);
        startCountdown();
      } else {
        const res = await translate({ data: { text: source, mode } });
        setOutput(res.translated);
        qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
        qc.invalidateQueries({ queryKey: ["history"] });
      }
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
    if (!output || isConfidential) return;
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

  // Verify decryption works (used for the "Reveal" toggle in confidential mode)
  const revealText = async (blob: EncryptedBlob | null) => {
    if (!blob || !sessionKey) return "";
    try {
      return await decryptText(sessionKey, blob);
    } catch {
      return "";
    }
  };
  const [revealedSource, setRevealedSource] = useState("");
  const [revealedOutput, setRevealedOutput] = useState("");
  useEffect(() => {
    if (!reveal) {
      setRevealedSource("");
      setRevealedOutput("");
      return;
    }
    (async () => {
      setRevealedSource(await revealText(encSource));
      setRevealedOutput(await revealText(encOutput));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal, encSource, encOutput]);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="grid h-10 w-10 place-items-center rounded-lg btn-neon"
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.06 }}
              transition={{ duration: 0.5 }}
            >
              <Languages className="h-5 w-5" />
            </motion.div>
            <div>
              <h1 className="font-display text-3xl font-bold">Translator</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Shield className="h-3 w-3 text-success" /> Secure session · AES-256 · Zero-storage AI pipeline
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mode selector */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {MODES.map((m, i) => {
            const active = mode === m.key;
            const Icon = m.icon;
            return (
              <motion.button
                key={m.key}
                onClick={() => setMode(m.key)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`relative overflow-hidden rounded-xl p-4 text-left transition ${
                  active ? "glass-strong border-primary/50" : "glass hover:border-primary/40"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="mode-halo"
                    className="absolute inset-0 -z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.82 0.18 220 / 0.15), oklch(0.65 0.24 300 / 0.15))",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold">{m.label}</span>
                  <span className="ml-auto rounded-full glass px-2 py-0.5 text-[10px] font-mono uppercase opacity-80">
                    {m.tag}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{m.desc}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Confidential status bar */}
        <AnimatePresence>
          {isConfidential && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 overflow-hidden"
            >
              <div className="glass-strong rounded-xl border-warning/30 p-4 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-warning shadow-[0_0_10px_currentColor] text-warning"
                  />
                  <span className="font-mono uppercase text-warning">Confidential session active</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <KeyRound className="h-3 w-3" />
                  <span className="font-mono">Key #{keyFp || "…"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  AES-256-GCM · client-side
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-3 w-3 text-success" />
                  Zero server persistence
                </div>
                {countdown !== null && (
                  <div className="flex items-center gap-2 text-warning ml-auto">
                    <Timer className="h-3 w-3" />
                    <span className="font-mono">Auto-wipe in {countdown}s</span>
                    <button
                      onClick={wipeSession}
                      className="rounded-md btn-outline-neon px-2 py-1 text-[10px]"
                    >
                      Wipe now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              placeholder={
                isConfidential
                  ? "Paste sensitive text — names, emails, IBANs are masked before leaving your device…"
                  : "Type or paste English text…"
              }
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
                {!isConfidential && (
                  <button
                    onClick={saveFavorite}
                    disabled={!output}
                    className="text-xs text-muted-foreground hover:text-warning flex items-center gap-1 disabled:opacity-40"
                  >
                    <Star className="h-3 w-3" /> Save
                  </button>
                )}
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
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full items-center justify-center text-muted-foreground text-sm gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isConfidential ? "Masking · encrypting · translating…" : "Translating securely…"}
                  </motion.div>
                ) : output ? (
                  <motion.div
                    key={output.slice(0, 20)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {output}
                  </motion.div>
                ) : (
                  <span className="text-muted-foreground/60">Your translation will appear here.</span>
                )}
              </AnimatePresence>
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

        {/* Confidential detail panel */}
        <AnimatePresence>
          {isConfidential && source.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className="mt-4 grid gap-4 lg:grid-cols-2"
            >
              {/* Detected PII */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase text-warning flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" /> Detected sensitive data
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {(detected.length || preview.matches.length)} match
                    {(detected.length || preview.matches.length) === 1 ? "" : "es"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 max-h-40 overflow-auto">
                  {(detected.length ? detected : preview.matches).map((m, i) => (
                    <motion.span
                      key={m.token + i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="rounded-full glass px-2 py-1 text-[11px] font-mono"
                    >
                      <span className="text-warning uppercase">{m.kind}</span>
                      <span className="mx-1 opacity-40">·</span>
                      <span>{m.token}</span>
                    </motion.span>
                  ))}
                  {!(detected.length || preview.matches.length) && (
                    <span className="text-xs text-muted-foreground">
                      No sensitive tokens detected in this text.
                    </span>
                  )}
                </div>
              </div>

              {/* Encrypted buffers */}
              <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase text-primary flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Encrypted buffers
                  </span>
                  <button
                    onClick={() => setReveal((r) => !r)}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    {reveal ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {reveal ? "Hide" : "Verify decrypt"}
                  </button>
                </div>
                <div className="mt-3 grid gap-2 text-[11px] font-mono max-h-40 overflow-auto">
                  <div>
                    <div className="text-muted-foreground uppercase text-[10px]">Source · ciphertext</div>
                    <div className="truncate text-primary/80">
                      {encSource ? `iv:${encSource.iv.slice(0, 12)}… ct:${encSource.ct.slice(0, 36)}…` : "—"}
                    </div>
                    {reveal && revealedSource && (
                      <div className="mt-1 rounded bg-background/40 p-2 text-foreground/80 whitespace-pre-wrap">
                        {revealedSource}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-muted-foreground uppercase text-[10px]">Output · ciphertext</div>
                    <div className="truncate text-secondary/80">
                      {encOutput ? `iv:${encOutput.iv.slice(0, 12)}… ct:${encOutput.ct.slice(0, 36)}…` : "—"}
                    </div>
                    {reveal && revealedOutput && (
                      <div className="mt-1 rounded bg-background/40 p-2 text-foreground/80 whitespace-pre-wrap">
                        {revealedOutput}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={doTranslate}
            disabled={loading || !source.trim() || (isConfidential && !sessionKey)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-lg btn-neon px-10 py-3 text-sm font-semibold flex items-center gap-2 disabled:opacity-40"
          >
            {isConfidential ? <Lock className="h-4 w-4" /> : <ArrowRightLeft className="h-4 w-4" />}
            {loading
              ? "Translating…"
              : isConfidential
                ? "Encrypt & Translate"
                : "Translate"}
          </motion.button>
        </div>

        {/* Security badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-xs">
          {(isConfidential
            ? ["AES-256-GCM", "PII Masked", "Zero Persistence", "Auto-Wipe Armed"]
            : ["Encryption Active", "Secure Session", "No Data Retained", "AI Verified"]
          ).map((b) => (
            <motion.span
              key={b}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-full px-3 py-1 font-mono flex items-center gap-1"
            >
              <Shield className="h-3 w-3 text-success" /> {b}
            </motion.span>
          ))}
        </div>
      </main>
    </div>
  );
}
