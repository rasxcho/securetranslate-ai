import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      if (data?.display_name) setName(data.display_name);
    })();
  }, []);

  const save = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: name,
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
    if (error) toast.error("Could not save"); else toast.success("Profile updated");
  };

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account details.</p>

        <div className="mt-8 glass-strong rounded-2xl p-8 space-y-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full btn-neon text-lg font-bold">
              {(name || email || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{name || "Unnamed user"}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          <Field label="Display name" icon={User}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </Field>

          <Field label="Email" icon={Mail}>
            <input
              value={email}
              disabled
              className="w-full bg-input/50 border border-border/60 rounded-lg px-3 py-2 text-sm opacity-70"
            />
          </Field>

          <button
            onClick={save}
            disabled={loading}
            className="rounded-lg btn-neon px-5 py-2.5 text-sm font-semibold flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </button>
        </div>
      </main>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-mono uppercase text-muted-foreground flex items-center gap-1">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
