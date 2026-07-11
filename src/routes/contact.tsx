import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — SecureTranslate AI" },
      { name: "description", content: "Contact the SecureTranslate AI team." },
    ],
  }),
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="min-h-screen px-6 py-16 max-w-xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="mt-6 glass-strong rounded-2xl p-10">
        <div className="grid h-12 w-12 place-items-center rounded-lg btn-neon">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Get in touch</h1>
        <p className="mt-2 text-sm text-muted-foreground">We usually respond within one business day.</p>

        {sent ? (
          <div className="mt-8 glass rounded-xl p-6 text-center">
            <p className="text-success font-semibold">Message sent</p>
            <p className="mt-1 text-sm text-muted-foreground">Thanks — we'll be in touch soon.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              toast.success("Message sent");
            }}
            className="mt-8 space-y-4"
          >
            <input required placeholder="Your name" className="w-full rounded-lg bg-input border border-border/60 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <input required type="email" placeholder="Email" className="w-full rounded-lg bg-input border border-border/60 px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <textarea required placeholder="How can we help?" rows={5} className="w-full rounded-lg bg-input border border-border/60 px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none" />
            <button className="w-full rounded-lg btn-neon py-3 text-sm font-semibold flex items-center justify-center gap-2">
              <Send className="h-4 w-4" /> Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
