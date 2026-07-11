import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/app-sidebar";
import { Star, Copy, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("translations")
        .select("*")
        .eq("is_favorite", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const unfav = async (id: string) => {
    await supabase.from("translations").update({ is_favorite: false }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["favorites"] });
    toast.success("Removed from favorites");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <Star className="h-6 w-6 text-warning fill-warning" /> Favorites
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Your saved translations.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {data.length === 0 && (
            <div className="glass rounded-2xl p-10 text-center text-muted-foreground text-sm md:col-span-2">
              Nothing here yet. Star a translation to save it.
            </div>
          )}
          {data.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-2xl p-5"
            >
              <p className="text-xs font-mono uppercase text-primary">EN</p>
              <p className="mt-1 text-sm">{r.source_text}</p>
              <p className="mt-3 text-xs font-mono uppercase text-secondary">DE</p>
              <p className="mt-1 text-sm">{r.translated_text}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(r.translated_text).then(() => toast.success("Copied"))}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button onClick={() => unfav(r.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
