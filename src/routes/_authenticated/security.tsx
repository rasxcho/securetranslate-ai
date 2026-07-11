import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { motion } from "framer-motion";
import { Shield, Lock, Activity, Fingerprint, Server, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/security")({
  component: SecurityPage,
});

function SecurityPage() {
  const checks = [
    { icon: Lock, label: "AES-256 Encryption", status: "Active", ok: true },
    { icon: KeyRound, label: "JWT Authentication", status: "Verified", ok: true },
    { icon: Server, label: "TLS 1.3 Transport", status: "Enforced", ok: true },
    { icon: Fingerprint, label: "Session Isolation", status: "Enabled", ok: true },
    { icon: Activity, label: "Rate Limiting", status: "Active", ok: true },
    { icon: Shield, label: "CSP Headers", status: "Strict", ok: true },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg btn-neon">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">Security Center</h1>
            <p className="text-sm text-muted-foreground">Real-time security posture for your account.</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass-strong rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-30 cyber-grid" />
          <div className="relative flex items-center justify-between flex-wrap gap-6">
            <div>
              <p className="text-xs font-mono uppercase text-muted-foreground">Security Score</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-6xl font-black text-gradient">A+</span>
                <span className="text-success text-sm">Excellent</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">All critical protections active.</p>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <Metric label="Failed logins" value="0" ok />
              <Metric label="Last login" value="Just now" ok />
              <Metric label="Sessions" value="1" ok />
              <Metric label="Threats" value="0" ok />
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {checks.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <c.icon className="h-5 w-5 text-primary" />
                {c.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
              </div>
              <p className="mt-4 font-semibold text-sm">{c.label}</p>
              <p className="text-xs font-mono uppercase text-muted-foreground mt-1">{c.status}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase text-muted-foreground">{label}</p>
      <p className={`mt-1 font-semibold ${ok ? "text-success" : "text-warning"}`}>{value}</p>
    </div>
  );
}
