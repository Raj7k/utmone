// Browser-safe utility for masking API keys
export function maskAPIKey(prefix: string): string {
  return `${prefix}${'*'.repeat(56)}`;
}
