// Sensitive-data detection & masking utilities used by Confidential mode.
// Runs on client AND server: pure regex/string logic, no browser APIs.

export type PiiKind =
  | "email"
  | "phone"
  | "credit_card"
  | "ssn"
  | "iban"
  | "ip"
  | "url"
  | "api_key"
  | "person";

export interface PiiMatch {
  kind: PiiKind;
  value: string;
  token: string;
}

// Order matters: more specific patterns first.
const PATTERNS: Array<{ kind: PiiKind; re: RegExp }> = [
  { kind: "email", re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  { kind: "url", re: /\bhttps?:\/\/[^\s<>()]+/g },
  { kind: "credit_card", re: /\b(?:\d[ -]*?){13,19}\b/g },
  { kind: "iban", re: /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g },
  { kind: "ssn", re: /\b\d{3}-\d{2}-\d{4}\b/g },
  { kind: "api_key", re: /\b(?:sk|pk|ghp|xox[baprs])_[A-Za-z0-9]{16,}\b/g },
  { kind: "ip", re: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g },
  { kind: "phone", re: /\+?\d[\d\s().-]{7,}\d/g },
  // Simple two-word capitalized name heuristic (best-effort).
  { kind: "person", re: /\b[A-Z][a-z]{1,}\s+[A-Z][a-z]{1,}\b/g },
];

export function detectAndMask(text: string): { masked: string; matches: PiiMatch[] } {
  const matches: PiiMatch[] = [];
  let masked = text;
  const counters: Record<string, number> = {};

  for (const { kind, re } of PATTERNS) {
    masked = masked.replace(re, (m) => {
      // Skip if already inside a token like ⟦EMAIL_1⟧
      if (/⟦[A-Z_]+_\d+⟧/.test(m)) return m;
      counters[kind] = (counters[kind] ?? 0) + 1;
      const token = `⟦${kind.toUpperCase()}_${counters[kind]}⟧`;
      matches.push({ kind, value: m, token });
      return token;
    });
  }
  return { masked, matches };
}

export function unmask(text: string, matches: PiiMatch[]): string {
  let out = text;
  for (const m of matches) {
    // Replace all occurrences of the token
    out = out.split(m.token).join(m.value);
  }
  return out;
}
