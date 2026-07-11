import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Languages,
  Shield,
  History,
  Star,
  TrendingUp,
  Activity,
  Zap,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { count } = await supabase
        .from("translations")
        .select("*", { count: "exact", head: true });
      const { count: favs } = await supabase
        .from("translations")
        .select("*", { count: "exact", head: true })
        .eq("is_favorite", true);
      return { total: count ?? 0, favorites: favs ?? 0 };
    },
  });

  const cards = [
    { title: "Translations", value: stats?.total ?? 0, icon: Languages, color: "text-primary" },
    { title: "Favorites", value: stats?.favorites ?? 0, icon: Star, color: "text-warning" },
    { title: "Security Score", value: "A+", icon: Shield, color: "text-success" },
    { title: "Session", value: "Active", icon: Activity, color: "text-secondary" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to your secure translation hub.</p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-muted-foreground">{c.title}</span>
                <c.icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <p className="mt-3 font-display text-3xl font-bold">{c.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-strong rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-30 cyber-grid" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-mono uppercase text-primary">
                <Zap className="h-3 w-3" /> Quick action
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">Start a new translation</h2>
              <p className="mt-2 text-muted-foreground text-sm">
                English → German. Simple or Pro mode. Encrypted end to end.
              </p>
              <Link
                to="/translator"
                className="mt-6 inline-flex items-center gap-2 rounded-lg btn-neon px-5 py-2.5 text-sm"
              >
                <Languages className="h-4 w-4" /> Open Translator
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-mono uppercase">Activity</span>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex justify-between"><span className="text-muted-foreground">Today</span><span>0 translations</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">This week</span><span>{stats?.total ?? 0} total</span></li>
              <li className="flex justify-between"><span className="text-muted-foreground">Streak</span><span>1 day</span></li>
            </ul>
            <Link
              to="/history"
              className="mt-6 flex items-center gap-2 text-xs text-primary hover:underline"
            >
              <History className="h-3 w-3" /> View full history
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
