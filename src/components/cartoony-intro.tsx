import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, Lock, Sparkles } from "lucide-react";

const STORAGE_KEY = "st_intro_seen_v1";

export function CartoonyIntro() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] grid place-items-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.14 0.08 285) 0%, #050816 70%)",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Sunburst rays */}
          <motion.div
            className="absolute inset-0"
            initial={{ rotate: 0, opacity: 0 }}
            animate={{ rotate: 360, opacity: 0.35 }}
            transition={{ rotate: { duration: 8, ease: "linear", repeat: Infinity }, opacity: { duration: 0.4 } }}
            style={{
              backgroundImage:
                "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.18 220 / 0.4) 8deg, transparent 16deg, transparent 30deg, oklch(0.65 0.24 300 / 0.4) 38deg, transparent 46deg)",
              maskImage: "radial-gradient(circle, black 20%, transparent 70%)",
            }}
          />

          {/* Bouncing shield */}
          <motion.div
            initial={{ scale: 0, rotate: -180, y: -200 }}
            animate={{
              scale: [0, 1.4, 0.9, 1.1, 1],
              rotate: [-180, 20, -10, 5, 0],
              y: [-200, 20, -10, 5, 0],
            }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], times: [0, 0.4, 0.6, 0.8, 1] }}
            className="relative"
          >
            <motion.div
              className="grid h-40 w-40 place-items-center rounded-3xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.82 0.18 220), oklch(0.65 0.24 300))",
                boxShadow:
                  "0 0 80px oklch(0.82 0.18 220 / 0.7), 0 0 160px oklch(0.65 0.24 300 / 0.5), inset 0 4px 30px oklch(1 0 0 / 0.3)",
              }}
              animate={{ boxShadow: [
                "0 0 60px oklch(0.82 0.18 220 / 0.6)",
                "0 0 120px oklch(0.65 0.24 300 / 0.7)",
                "0 0 60px oklch(0.82 0.18 220 / 0.6)",
              ] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <Shield className="h-20 w-20 text-background" strokeWidth={2.5} />
            </motion.div>

            {/* Pop sparkles */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <motion.div
                key={deg}
                className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
                style={{ background: i % 2 ? "oklch(0.82 0.18 220)" : "oklch(0.65 0.24 300)" }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                animate={{
                  x: Math.cos((deg * Math.PI) / 180) * 140,
                  y: Math.sin((deg * Math.PI) / 180) * 140,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 0.9, delay: 0.6 + i * 0.04, ease: "easeOut" }}
              />
            ))}

            {/* Orbiting mini icons */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, ease: "linear", repeat: Infinity }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 grid h-8 w-8 place-items-center rounded-full glass-strong">
                <Lock className="h-4 w-4 text-primary" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 grid h-8 w-8 place-items-center rounded-full glass-strong">
                <Sparkles className="h-4 w-4 text-secondary" />
              </div>
            </motion.div>
          </motion.div>

          {/* Wordmark bounces in */}
          <motion.div
            className="absolute bottom-[28%] text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.h1
              className="font-display text-4xl md:text-5xl font-black tracking-tight text-gradient"
              animate={{ letterSpacing: ["0.5em", "-0.02em"] }}
              transition={{ delay: 1.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              SecureTranslate
            </motion.h1>
            <motion.p
              className="mt-2 font-mono text-xs uppercase text-primary/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.4 }}
            >
              &gt; Booting encrypted session_
            </motion.p>
          </motion.div>

          {/* Scan line */}
          <motion.div
            className="absolute inset-x-0 h-[3px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.82 0.18 220), transparent)",
              boxShadow: "0 0 20px oklch(0.82 0.18 220)",
            }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.8, delay: 0.3, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
