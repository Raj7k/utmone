import { describe, expect, it } from "vitest";
import { checkEmailQuality, getDisposableDomainSeed } from "./emailQuality";

describe("checkEmailQuality", () => {
  it("accepts valid company emails", () => {
    const result = checkEmailQuality("team@utm.one");
    expect(result.ok).toBe(true);
    expect(result.reason).toBe("ok");
    expect(result.normalizedEmail).toBe("team@utm.one");
  });

  it("suggests fixes for common provider typos", () => {
    const result = checkEmailQuality("alex@gmial.com");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("invalid_domain");
    expect(result.suggestion).toBe("alex@gmail.com");
  });

  it("identifies disposable domains", () => {
    const result = checkEmailQuality("temp@mailinator.com");
    expect(result.reason).toBe("disposable");
    expect(result.ok).toBe(false);
    expect(result.isDisposable).toBe(true);
  });

  it("normalizes casing and whitespace", () => {
    const result = checkEmailQuality("  MIXED@Example.COM  ");
    expect(result.normalizedEmail).toBe("mixed@example.com");
  });

  it("allows opt-in disposable acceptance while flagging", () => {
    const disposable = getDisposableDomainSeed()[0];
    const result = checkEmailQuality(`user@${disposable}`, { allowDisposable: true });
    expect(result.ok).toBe(true);
    expect(result.reason).toBe("disposable");
    expect(result.isDisposable).toBe(true);
  });

  it("rejects structurally invalid domains", () => {
    const result = checkEmailQuality("user@invalid_domain");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("invalid_domain");
  });
});
