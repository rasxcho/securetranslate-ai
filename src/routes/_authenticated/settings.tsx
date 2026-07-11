import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { Bell, Globe, Moon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const deleteAll = async () => {
    if (!confirm("Delete all your translation history? This cannot be undone.")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("translations").delete().eq("user_id", user.id);
    toast.success("History cleared");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Preferences, notifications, and privacy.</p>

        <div className="mt-8 space-y-4">
          <Row icon={Moon} title="Theme" desc="Dark mode is always on in this build.">
            <span className="text-xs font-mono text-primary">DARK</span>
          </Row>
          <Row icon={Bell} title="Email notifications" desc="Product updates and security alerts.">
            <Toggle />
          </Row>
          <Row icon={Globe} title="Default target language" desc="Only German is available in this build.">
            <span className="text-xs font-mono text-primary">DE</span>
          </Row>
          <Row icon={Trash2} title="Clear all history" desc="Permanently delete every saved translation.">
            <button
              onClick={deleteAll}
              className="rounded-lg px-3 py-1.5 text-xs bg-destructive/20 border border-destructive/40 text-destructive hover:bg-destructive/30"
            >
              Delete
            </button>
          </Row>
        </div>
      </main>
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle() {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked className="sr-only peer" />
      <div className="w-10 h-5 rounded-full bg-muted peer-checked:bg-primary relative transition after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}
