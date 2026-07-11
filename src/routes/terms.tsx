import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms — SecureTranslate AI" },
      { name: "description", content: "Terms of service for SecureTranslate AI." },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="mt-6 glass-strong rounded-2xl p-10 space-y-4 text-sm text-muted-foreground">
        <h1 className="font-display text-3xl font-bold text-foreground">Terms of Service</h1>
        <p>By using SecureTranslate AI you agree to these terms. Please read them carefully.</p>
        <h2 className="font-display text-xl font-semibold text-foreground pt-4">Acceptable use</h2>
        <p>Do not use the service to translate content you don't have rights to, or to violate any law.</p>
        <h2 className="font-display text-xl font-semibold text-foreground pt-4">Accuracy</h2>
        <p>Translations are produced by AI. Please review important translations before relying on them.</p>
        <h2 className="font-display text-xl font-semibold text-foreground pt-4">Availability</h2>
        <p>We aim for high uptime but do not guarantee uninterrupted service.</p>
      </div>
    </div>
  );
}
