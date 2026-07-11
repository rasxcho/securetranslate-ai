import { createFileRoute, Link } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { HelpCircle, Mail, Book } from "lucide-react";

export const Route = createFileRoute("/_authenticated/help")({
  component: HelpPage,
});

function HelpPage() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" /> Help Center
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Get help using SecureTranslate AI.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <Book className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">Getting started</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Open the Translator, paste English text, choose Simple or Pro mode, and click Translate.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <Mail className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">Contact support</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Reach us via the <Link to="/contact" className="text-primary hover:underline">contact page</Link> for help.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
