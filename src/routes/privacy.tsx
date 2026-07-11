import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — SecureTranslate AI" },
      { name: "description", content: "How SecureTranslate AI handles your data." },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="mt-6 glass-strong rounded-2xl p-10 space-y-4 text-sm text-muted-foreground">
        <h1 className="font-display text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p>This page describes how SecureTranslate AI handles the data you provide.</p>
        <h2 className="font-display text-xl font-semibold text-foreground pt-4">Data we collect</h2>
        <p>Account email and translations you choose to save. No trackers, no third-party analytics on the app surface.</p>
        <h2 className="font-display text-xl font-semibold text-foreground pt-4">AI processing</h2>
        <p>Text is sent to an AI provider for translation. It is not retained by the provider for training.</p>
        <h2 className="font-display text-xl font-semibold text-foreground pt-4">Your rights</h2>
        <p>You can export or delete your data at any time from the Settings page.</p>
      </div>
    </div>
  );
}
