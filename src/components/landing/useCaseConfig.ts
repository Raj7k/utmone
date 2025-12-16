export const MARKETING_USE_CASES = [
  "attribution",
  "journey",
  "links",
  "intelligence",
  "governance",
  "linkpages",
  "eventhalo",
] as const;

export type UseCaseType = typeof MARKETING_USE_CASES[number];

export const DEFAULT_USE_CASE: UseCaseType = "attribution";

const FALLBACK_USE_CASES: Partial<Record<UseCaseType, UseCaseType>> = {
  linkpages: "links",
  eventhalo: "intelligence",
};

export const isUseCase = (value: unknown): value is UseCaseType =>
  typeof value === "string" && MARKETING_USE_CASES.includes(value as UseCaseType);

export const normalizeUseCase = (value?: UseCaseType | string | null): UseCaseType =>
  isUseCase(value) ? (value as UseCaseType) : DEFAULT_USE_CASE;

export function resolveUseCaseContent<T>({
  contentMap,
  useCase,
  fallbackUseCase,
  defaultContent,
  section,
}: {
  contentMap: Partial<Record<UseCaseType, T>>;
  useCase: UseCaseType;
  fallbackUseCase?: UseCaseType;
  defaultContent: T;
  section: string;
}): { resolvedUseCase: UseCaseType; content: T } {
  const normalizedUseCase = normalizeUseCase(useCase);
  const preferredFallback = fallbackUseCase ?? FALLBACK_USE_CASES[normalizedUseCase] ?? DEFAULT_USE_CASE;

  const resolvedContent = contentMap[normalizedUseCase] ?? contentMap[preferredFallback];
  if (!contentMap[normalizedUseCase]) {
    console.warn(
      `[marketing] missing ${section} config for "${normalizedUseCase}". Falling back to "${preferredFallback}".`
    );
  }

  if (resolvedContent) {
    return {
      resolvedUseCase: contentMap[normalizedUseCase] ? normalizedUseCase : preferredFallback,
      content: resolvedContent,
    };
  }

  const firstAvailableContent = Object.values(contentMap)[0];
  if (firstAvailableContent) {
    return {
      resolvedUseCase: preferredFallback,
      content: firstAvailableContent as T,
    };
  }

  console.warn(
    `[marketing] no content map available for ${section}. Using provided default content instead of crashing.`
  );

  return {
    resolvedUseCase: DEFAULT_USE_CASE,
    content: defaultContent,
  };
}
