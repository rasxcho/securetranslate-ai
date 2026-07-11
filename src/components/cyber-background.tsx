import { motion } from "framer-motion";

export function CyberBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0" style={{ background: "#050816" }} />
      
      {/* Radial glows */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 20% 20%, oklch(0.65 0.24 300 / 0.25), transparent), radial-gradient(ellipse 50% 40% at 80% 70%, oklch(0.82 0.18 220 / 0.22), transparent)",
        }}
      />

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "oklch(0.65 0.24 300 / 0.35)" }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "oklch(0.82 0.18 220 / 0.3)" }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-primary"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            boxShadow: "0 0 6px currentColor",
          }}
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}

      {/* Scan line */}
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.82 0.18 220 / 0.6), transparent)",
        }}
        animate={{ y: ["0vh", "100vh"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
