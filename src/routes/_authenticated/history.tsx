import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/app-sidebar";
import { Search, Star, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("translations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const filtered = data.filter(
    (r) =>
      !q ||
      r.source_text.toLowerCase().includes(q.toLowerCase()) ||
      r.translated_text.toLowerCase().includes(q.toLowerCase()),
  );

  const toggleFav = async (id: string, cur: boolean) => {
    await supabase.from("translations").update({ is_favorite: !cur }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["history"] });
    qc.invalidateQueries({ queryKey: ["favorites"] });
  };
  const del = async (id: string) => {
    await supabase.from("translations").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["history"] });
    toast.success("Deleted");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-3xl font-bold">History</h1>
        <p className="text-muted-foreground text-sm mt-1">Recent translations, encrypted at rest.</p>

        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search history…"
            className="w-full rounded-lg bg-input border border-border/60 pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="mt-6 space-y-3">
          {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
          {!isLoading && filtered.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground text-sm">
              No translations yet.
            </div>
          )}
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono uppercase text-primary">EN</p>
                  <p className="mt-1 text-sm truncate">{r.source_text}</p>
                  <p className="text-xs font-mono uppercase text-secondary mt-3">DE</p>
                  <p className="mt-1 text-sm truncate">{r.translated_text}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => toggleFav(r.id, r.is_favorite)} className="text-muted-foreground hover:text-warning">
                    <Star className={`h-4 w-4 ${r.is_favorite ? "fill-warning text-warning" : ""}`} />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(r.translated_text);
                      toast.success("Copied");
                    }}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => del(r.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex gap-3 text-[10px] font-mono uppercase text-muted-foreground">
                <span>{new Date(r.created_at).toLocaleString()}</span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">{r.mode}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
