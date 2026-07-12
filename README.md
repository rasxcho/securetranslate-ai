# SecureTranslate AI

> Premium, cyberpunk-themed AI translation platform with privacy-first architecture, PII masking, and ephemeral confidential sessions.

SecureTranslate AI is a production-grade SaaS built on TanStack Start (React 19 + Vite 7), Lovable Cloud (Supabase) and the Lovable AI Gateway (Gemini). It ships with three translation modes — **Simple**, **Pro**, and **Confidential** — a glassmorphism cyberpunk UI, animated cartoony intro, and a full auth + dashboard experience.

---

## ✨ Features

- 🔐 **Auth** — Email/password + Google OAuth, secure sessions, RLS-protected data
- 🌐 **AI Translation** — Powered by Gemini via the Lovable AI Gateway
- 🧭 **Three Modes**
  - **Simple** — Fast everyday translation
  - **Pro** — Higher-quality, context-aware output with tone & formality controls
  - **Confidential** — PII detection & masking, AES-GCM in-memory encryption, zero DB persistence, auto-wipe after 60 s
- 🎨 **Cyberpunk UI** — Glassmorphism, neon glow, particle grid backgrounds, Framer Motion transitions
- 🎬 **Cartoony intro animation** — First-visit welcome sequence
- 📊 **Dashboard** — History, Favorites, Security Center, Profile, Settings, Help
- 📱 **Responsive** — Mobile-first, works from phone to ultrawide
- 🛡 **Security by design** — RLS on all tables, ephemeral crypto for confidential mode, no plaintext logging

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | TanStack Start v1 (React 19, Vite 7) |
| Styling | Tailwind CSS v4 + custom design tokens |
| UI | shadcn/ui, Framer Motion, Lucide icons |
| Routing | TanStack Router (file-based) |
| Backend | Lovable Cloud (Supabase — Postgres, Auth, RLS) |
| AI | Lovable AI Gateway (`google/gemini-2.5-flash`) |
| Crypto | Web Crypto API (AES-GCM 256) |
| Deploy | Cloudflare Workers (edge) |

---

## 🚀 Getting Started

### Prerequisites

- **Bun** ≥ 1.1 (or Node ≥ 20 + npm)
- A **Lovable Cloud** project (auto-provisioned) or your own Supabase project
- A **Lovable AI Gateway** key (auto-injected in Lovable, or set manually)

### 1. Clone

```bash
git clone https://github.com/<your-user>/securetranslate-ai.git
cd securetranslate-ai
```

### 2. Install

```bash
bun install
```

### 3. Environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

See [Environment Variables](#-environment-variables) below.

### 4. Run the dev server

```bash
bun run dev
```

Open http://localhost:8080.

### 5. Build for production

```bash
bun run build
```

---

## 🔑 Environment Variables

| Name | Required | Description |
|------|----------|-------------|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase / Lovable Cloud project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Publishable (anon) key — safe for the browser |
| `VITE_SUPABASE_PROJECT_ID` | ✅ | Project ref |
| `LOVABLE_API_KEY` | ✅ | Server-side key for the Lovable AI Gateway (Gemini) |

> On Lovable, all four are injected automatically. When self-hosting, set them in your hosting provider (Cloudflare Workers, Vercel, etc.).

---

## 🗄 Database

Migrations live in `supabase/migrations/`. Two main tables:

- `profiles` — user profile info, mirrored from `auth.users`
- `translations` — translation history (Simple + Pro only; Confidential never writes here)

Row-Level Security is enabled on every table with `auth.uid()`-scoped policies.

---

## 🕶 Confidential Mode — how it works

Confidential mode is designed so that **no sensitive text ever touches disk, logs, or the AI provider in plaintext**.

### Pipeline

```
 user input
    │
    ▼
[1] PII detection (client)          src/lib/pii.ts
    → regex scan for emails, phones, IBAN, credit cards,
      SSNs, IPs, API keys, names, addresses
    │
    ▼
[2] Tokenization (client)
    → each PII match replaced with an opaque token
      e.g.  ⟦EMAIL_1⟧  ⟦PHONE_2⟧  ⟦CARD_1⟧
    │
    ▼
[3] Ephemeral encryption (client)   src/lib/session-crypto.ts
    → AES-GCM 256, key generated per session, held in memory only
    │
    ▼
[4] Server function                 src/lib/translate.functions.ts
    → `ephemeral: true` flag
    → tokens are opaque to Gemini; model preserves them verbatim
    → NOTHING is written to the `translations` table
    │
    ▼
[5] Client-side unmasking
    → tokens swapped back with the original PII values
    │
    ▼
[6] Auto-wipe (60 s countdown)
    → key zeroed, ciphertext buffers cleared,
      token map destroyed, UI state reset
```

### Guarantees

- ✅ Original PII never leaves the browser
- ✅ AI provider only sees tokenized text
- ✅ No database persistence (`ephemeral: true`)
- ✅ Encryption key lives only in JS memory, never in `localStorage`
- ✅ Session auto-destroys after 60 s of inactivity or on manual "End Session"
- ✅ Closing the tab wipes all state

### What is detected

Emails, phone numbers, credit cards (Luhn-validated), IBAN, SSN, IPv4/IPv6, API keys / bearer tokens, common name patterns, postal addresses. Extend detectors in `src/lib/pii.ts`.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── app-sidebar.tsx
│   ├── cartoony-intro.tsx          # First-visit animation
│   └── cyber-background.tsx        # Particle grid background
├── integrations/
│   └── supabase/                   # Auto-generated client (do not edit)
├── lib/
│   ├── pii.ts                      # PII detection + tokenization
│   ├── session-crypto.ts           # AES-GCM ephemeral encryption
│   └── translate.functions.ts      # createServerFn — AI Gateway call
├── routes/
│   ├── __root.tsx
│   ├── index.tsx                   # Landing page
│   ├── auth.tsx
│   ├── about.tsx  contact.tsx  privacy.tsx  terms.tsx
│   └── _authenticated/
│       ├── route.tsx               # Auth gate
│       ├── dashboard.tsx
│       ├── translator.tsx          # Main product surface
│       ├── history.tsx  favorites.tsx
│       ├── security.tsx            # Security posture center
│       ├── profile.tsx  settings.tsx  help.tsx
│       └── ...
├── styles.css                      # Tailwind v4 + design tokens
└── start.ts                        # TanStack Start entry
supabase/
└── migrations/                     # SQL migrations
```

---

## 🧪 Scripts

```bash
bun run dev          # Dev server on :8080
bun run build        # Production build
bun run typecheck    # tsgo type check
```

---

## 🛡 Security Notes

- All Supabase tables enable RLS with `auth.uid()`-scoped policies
- Server functions requiring auth use `requireSupabaseAuth` middleware
- Confidential mode: see [Confidential Mode](#-confidential-mode--how-it-works)
- Never commit `.env` — only `.env.example` is checked in
- The service-role key is **never** shipped to the client and not required for the app to run

Report vulnerabilities via a private security advisory on GitHub.

---

## 📦 Deployment

The project targets **Cloudflare Workers** via TanStack Start. Any edge/Node host that runs a Vite SSR build works. Set the four env vars above in your host and deploy the output of `bun run build`.

For one-click deploys, publish directly from Lovable.

---

## 📜 License

MIT © SecureTranslate AI contributors
