import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Zap,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Eye,
  KeyRound,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "SecureTranslate AI — Secure English↔German AI Translation" },
      {
        name: "description",
        content:
          "AI-powered English to German translation with enterprise-grade cybersecurity. Encrypted, private, and instant.",
      },
    ],
  }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg btn-neon">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-wider">
            SecureTranslate<span className="text-primary">.AI</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#pricing" className="hover:text-primary transition">Pricing</a>
          <a href="#faq" className="hover:text-primary transition">FAQ</a>
          <Link to="/about" className="hover:text-primary transition">About</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link
            to="/auth"
            className="rounded-lg btn-neon px-4 py-2 text-sm inline-flex items-center gap-1"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const stats = [
    "AES-256 Encryption",
    "AI Translation",
    "Privacy First",
    "GDPR Ready",
    "Zero Data Storage",
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-36 text-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" /> Secure AI · v2026.1
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-6 font-display text-5xl md:text-7xl font-black leading-[1.05]"
        >
          <span className="text-gradient animate-gradient">SecureTranslate</span>
          <br />
          <span className="text-foreground">AI</span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          AI-powered English to German translation with enterprise-grade
          cybersecurity. Fast, encrypted, private by design.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Link
            to="/auth"
            className="rounded-lg btn-neon px-7 py-3 text-sm inline-flex items-center gap-2"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="rounded-lg btn-outline-neon px-7 py-3 text-sm"
          >
            Learn More
          </a>
        </motion.div>

        <motion.ul
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.45 }}
          className="mt-14 flex flex-wrap justify-center gap-3 text-xs"
        >
          {stats.map((s) => (
            <li
              key={s}
              className="glass rounded-full px-4 py-2 flex items-center gap-2 font-mono"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              {s}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Zap,
      title: "Simple Translation",
      desc: "Instant, natural English → German translation powered by state-of-the-art AI.",
      color: "text-primary",
    },
    {
      icon: Cpu,
      title: "Pro Translation",
      desc: "Formal, business-ready German with refined grammar, tone, and vocabulary.",
      color: "text-secondary",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      desc: "AES-256 encryption in transit, zero data storage, GDPR-ready pipeline.",
      color: "text-success",
    },
    {
      icon: Eye,
      title: "Privacy First",
      desc: "Your translations are never used to train models. Sessions auto-purge.",
      color: "text-primary",
    },
    {
      icon: Globe,
      title: "Global Ready",
      desc: "Optimized for professional contexts — legal, technical, medical, business.",
      color: "text-secondary",
    },
    {
      icon: KeyRound,
      title: "Secure Auth",
      desc: "JWT sessions, Google sign-in, protected routes, and hardened middleware.",
      color: "text-success",
    },
  ];

  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Built for <span className="text-gradient">security & speed</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every translation flows through a hardened pipeline designed to protect
            your data end-to-end.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 group transition-all hover:border-primary/40"
            >
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl bg-primary/10 ${it.color} group-hover:animate-pulse-glow`}
              >
                <it.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const list = [
    {
      quote:
        "Finally a translator I can trust with client work. The pro mode reads like a native German speaker wrote it.",
      name: "Klara Meier",
      role: "Legal Consultant, Berlin",
    },
    {
      quote:
        "Zero data retention was the deal-breaker for our compliance team. Fast, accurate, and beautifully designed.",
      name: "James Ortega",
      role: "CISO, FinTech",
    },
    {
      quote:
        "The cyberpunk UI is gorgeous but the actual translation quality is what keeps me on the paid plan.",
      name: "Priya Shah",
      role: "Product Lead",
    },
  ];
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center font-display text-4xl font-bold">
          Trusted by <span className="text-gradient">security-first teams</span>
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {list.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6">
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "For casual use",
      features: ["100 translations / month", "Simple mode", "History (7 days)"],
      cta: "Start Free",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$12",
      desc: "For professionals",
      features: [
        "Unlimited translations",
        "Simple + Pro modes",
        "Unlimited history",
        "Favorites & exports",
        "Priority AI models",
      ],
      cta: "Go Pro",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "For teams",
      features: [
        "Everything in Pro",
        "SSO / SAML",
        "Team management",
        "SLA & audit logs",
        "Dedicated support",
      ],
      cta: "Contact Sales",
      highlight: false,
    },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            Simple <span className="text-gradient">pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you need power.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -6 }}
              className={`rounded-2xl p-8 ${
                t.highlight
                  ? "glass-strong border-primary/40 neon-glow relative"
                  : "glass"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full btn-neon px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-2xl font-bold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-black font-display">{t.price}</span>
                {t.price.startsWith("$") && t.price !== "$0" && (
                  <span className="text-sm text-muted-foreground">/mo</span>
                )}
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-8 block rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                  t.highlight ? "btn-neon" : "btn-outline-neon"
                }`}
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Is my text stored or used to train AI models?",
      a: "No. Translations are processed in transient, encrypted sessions and never used to train models. History is stored only in your account if you're signed in, and you can delete it anytime.",
    },
    {
      q: "Which languages are supported?",
      a: "The current release focuses on English ↔ German. Additional language pairs are on the roadmap.",
    },
    {
      q: "What's the difference between Simple and Pro modes?",
      a: "Simple returns fast, natural translations. Pro polishes grammar, formality, and tone for business, legal, and technical contexts.",
    },
    {
      q: "How is my data encrypted?",
      a: "All traffic uses TLS 1.3. Sessions and credentials use industry-standard JWT with server-side validation. Sensitive fields are hashed with bcrypt.",
    },
  ];
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-4xl font-bold">
          Frequently asked <span className="text-gradient">questions</span>
        </h2>
        <div className="mt-10 space-y-4">
          {items.map((it, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-xl p-5 group"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between font-semibold">
                {it.q}
                <span className="text-primary group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 mt-16">
      <div className="mx-auto max-w-7xl px-6 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg btn-neon">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-display font-bold">SecureTranslate.AI</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Encrypted AI translation for the modern web.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Product</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="#features" className="hover:text-primary">Features</a></li>
            <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
            <li><Link to="/auth" className="hover:text-primary">Sign in</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Legal</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-primary">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms</Link></li>
          </ul>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SecureTranslate AI · Built with security in mind.
      </p>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
