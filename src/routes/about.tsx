import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — SecureTranslate AI" },
      { name: "description", content: "Learn about SecureTranslate AI — secure, AI-powered translation." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="mt-6 glass-strong rounded-2xl p-10">
        <div className="grid h-12 w-12 place-items-center rounded-lg btn-neon">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="mt-6 font-display text-4xl font-bold">About SecureTranslate AI</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          SecureTranslate AI was built on a simple premise: translation tools shouldn't leak your data.
          We combine state-of-the-art large language models with an end-to-end secure pipeline so
          professionals can translate confidently.
        </p>
        <h2 className="mt-8 font-display text-xl font-semibold">Our mission</h2>
        <p className="mt-2 text-muted-foreground">
          To make private, high-quality AI translation accessible to individuals, teams, and enterprises
          — without compromise.
        </p>
        <h2 className="mt-8 font-display text-xl font-semibold">Principles</h2>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground list-disc pl-5">
          <li>Zero data retention on the AI pipeline</li>
          <li>Encryption at rest and in transit</li>
          <li>Transparent, GDPR-friendly design</li>
          <li>Beautiful software that respects your time</li>
        </ul>
      </div>
    </div>
  );
}
