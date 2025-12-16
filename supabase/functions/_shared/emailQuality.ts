export type EmailQualityReason =
  | "ok"
  | "empty"
  | "invalid_format"
  | "invalid_domain"
  | "disposable"
  | "blocked";

export interface EmailQualityResult {
  ok: boolean;
  normalizedEmail: string | null;
  reason: EmailQualityReason;
  suggestion?: string;
  isDisposable?: boolean;
  domain?: string;
}

export interface CheckEmailQualityOptions {
  allowDisposable?: boolean;
  disposableDomains?: Iterable<string>;
  blockedDomains?: Iterable<string>;
}

const COMMON_PROVIDERS = [
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "hey.com",
  "fastmail.com",
  "aol.com",
];

const COMMON_TLDS = [
  "com",
  "net",
  "org",
  "co",
  "io",
  "ai",
  "app",
  "dev",
  "me",
  "email",
  "cloud",
];

const COMMON_TYPOS: Record<string, string> = {
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaik.com": "gmail.com",
  "gmaol.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmaul.com": "gmail.com",
  "gmal.com": "gmail.com",
  "protonmail.com": "proton.me",
  "hotnail.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllook.com": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "icloud.co": "icloud.com",
};

const DISPOSABLE_SEED = [
  "10minutemail.com",
  "20minutemail.com",
  "dispostable.com",
  "emailondeck.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerillamail.com",
  "guerillamail.net",
  "inboxalias.com",
  "maildrop.cc",
  "mailinator.com",
  "mail-temp.com",
  "mintemail.com",
  "mohmal.com",
  "mytemp.email",
  "nada.ltd",
  "pokemail.net",
  "sharklasers.com",
  "spam4.me",
  "tempmail.com",
  "tempmailo.com",
  "tempr.email",
  "trashmail.com",
  "yopmail.com",
];

const BLOCKED_DOMAINS = ["example.com", "test.com", "invalid.com", "fake.com"];

const BLOCKED_LOCAL_PATTERNS = [
  /^test\d*$/i,
  /^fake/i,
  /^no[-_]?reply/i,
  /^noreply/i,
  /^admin$/i,
  /^user\d*$/i,
];

const normalizeEmail = (input: string): string => {
  const trimmed = input.trim();
  const parts = trimmed.split("@");
  if (parts.length < 2) {
    return trimmed.toLowerCase();
  }

  const local = parts[0].replace(/\s+/g, "").toLowerCase();
  const domain = parts.slice(1).join("@").toLowerCase();
  return `${local}@${domain}`;
};

const isFormatValid = (email: string): boolean => {
  const formatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return formatRegex.test(email);
};

const isDomainStructurallyValid = (domain: string): boolean => {
  if (!domain || domain.includes(" ")) return false;
  if (domain.startsWith("-") || domain.endsWith("-")) return false;
  if (domain.includes("..")) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;

  return labels.every(
    (label) => !!label && /^[a-z0-9-]+$/i.test(label) && !label.startsWith("-") && !label.endsWith("-"),
  );
};

const levenshtein = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
};

const findClosestDomain = (domain: string): string | undefined => {
  let bestDomain: string | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const candidate of COMMON_PROVIDERS) {
    const distance = levenshtein(domain, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestDomain = candidate;
    }
  }

  return bestDistance <= 2 ? bestDomain : undefined;
};

const suggestFix = (email: string): string | undefined => {
  const [local, domain = ""] = email.split("@");
  if (!domain) return undefined;

  const normalizedDomain = domain.toLowerCase();

  if (COMMON_TYPOS[normalizedDomain]) {
    return `${local}@${COMMON_TYPOS[normalizedDomain]}`;
  }

  const domainParts = normalizedDomain.split(".");
  const tld = domainParts.at(-1);

  if (tld) {
    const closestTld = COMMON_TLDS.reduce(
      (best, current) => {
        const distance = levenshtein(tld, current);
        if (distance < best.distance) {
          return { value: current, distance };
        }
        return best;
      },
      { value: tld, distance: Number.POSITIVE_INFINITY },
    );

    if (closestTld.distance === 1 && closestTld.value !== tld) {
      const base = domainParts.slice(0, -1).join(".");
      return `${local}@${base}.${closestTld.value}`;
    }
  }

  const closestDomain = findClosestDomain(normalizedDomain);
  if (closestDomain) {
    return `${local}@${closestDomain}`;
  }

  return undefined;
};

const buildDisposableSet = (overrides?: Iterable<string>): Set<string> => {
  const custom = overrides ? Array.from(overrides).map((d) => d.toLowerCase()) : [];
  return new Set([...DISPOSABLE_SEED, ...custom]);
};

export const checkEmailQuality = (
  input: string,
  options: CheckEmailQualityOptions = {},
): EmailQualityResult => {
  if (!input || !input.trim()) {
    return { ok: false, normalizedEmail: null, reason: "empty" };
  }

  const normalizedEmail = normalizeEmail(input);

  if (!isFormatValid(normalizedEmail)) {
    return {
      ok: false,
      normalizedEmail: null,
      reason: "invalid_format",
      suggestion: suggestFix(normalizedEmail),
    };
  }

  const [local, domain = ""] = normalizedEmail.split("@");
  if (!isDomainStructurallyValid(domain)) {
    return {
      ok: false,
      normalizedEmail,
      reason: "invalid_domain",
      suggestion: suggestFix(normalizedEmail),
      domain,
    };
  }

  if (BLOCKED_LOCAL_PATTERNS.some((pattern) => pattern.test(local))) {
    return { ok: false, normalizedEmail, reason: "blocked", domain };
  }

  const blockedDomainSet = new Set([
    ...BLOCKED_DOMAINS,
    ...(options.blockedDomains ? Array.from(options.blockedDomains).map((d) => d.toLowerCase()) : []),
  ]);

  if (blockedDomainSet.has(domain)) {
    return { ok: false, normalizedEmail, reason: "blocked", domain };
  }

  const typoSuggestion = suggestFix(normalizedEmail);
  if (typoSuggestion) {
    return {
      ok: false,
      normalizedEmail,
      reason: "invalid_domain",
      suggestion: typoSuggestion,
      domain,
    };
  }

  const disposableSet = buildDisposableSet(options.disposableDomains);
  if (disposableSet.has(domain)) {
    return {
      ok: options.allowDisposable ?? false,
      normalizedEmail,
      reason: "disposable",
      suggestion: undefined,
      isDisposable: true,
      domain,
    };
  }

  return { ok: true, normalizedEmail, reason: "ok", domain };
};
