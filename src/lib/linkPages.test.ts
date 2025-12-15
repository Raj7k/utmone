import { describe, expect, it } from "vitest";
import { filterEnabledBlocks, isValidLinkPageSlug } from "./linkPages";

describe("isValidLinkPageSlug", () => {
  it("accepts simple slugs", () => {
    expect(isValidLinkPageSlug("my-page")).toBe(true);
    expect(isValidLinkPageSlug("abc123".toLowerCase())).toBe(true);
  });

  it("rejects short, long, or invalid slugs", () => {
    expect(isValidLinkPageSlug("ab")).toBe(false);
    expect(isValidLinkPageSlug("".padStart(70, "a"))).toBe(false);
    expect(isValidLinkPageSlug("No Spaces".toLowerCase())).toBe(false);
    expect(isValidLinkPageSlug("bad#slug")).toBe(false);
  });
});

describe("filterEnabledBlocks", () => {
  it("sorts and hides disabled blocks", () => {
    const blocks = [
      { id: "b", page_id: "1", type: "link", order_index: 1, data: {}, is_enabled: true },
      { id: "a", page_id: "1", type: "text", order_index: 0, data: {}, is_enabled: false },
      { id: "c", page_id: "1", type: "link", order_index: 2, data: {}, is_enabled: true },
    ];

    const filtered = filterEnabledBlocks(blocks as any);
    expect(filtered.map(b => b.id)).toEqual(["b", "c"]);
  });
});
