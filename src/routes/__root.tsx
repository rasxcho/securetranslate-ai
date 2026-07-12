import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CyberBackground } from "../components/cyber-background";
import { CartoonyIntro } from "../components/cartoony-intro";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-8xl font-bold text-gradient font-display">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Signal Lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has drifted off the grid.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md btn-neon px-6 py-2 text-sm"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-2xl font-semibold text-destructive">System Error</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something disrupted the connection. Try again or return home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md btn-neon px-4 py-2 text-sm"
          >
            Retry
          </button>
          <a href="/" className="rounded-md btn-outline-neon px-4 py-2 text-sm">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SecureTranslate AI — Secure English↔German AI Translation" },
      {
        name: "description",
        content:
          "SecureTranslate AI delivers AI-powered English to German translation with enterprise-grade privacy and encryption. Fast, accurate, and secure by design.",
      },
      { name: "author", content: "SecureTranslate AI" },
      { property: "og:title", content: "SecureTranslate AI" },
      {
        property: "og:description",
        content:
          "AI-powered English to German translation with enterprise-grade cybersecurity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <CyberBackground />
      <CartoonyIntro />
      <Outlet />
      <Toaster theme="dark" position="top-right" />
    </QueryClientProvider>
  );
}
