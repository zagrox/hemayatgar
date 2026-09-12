import { describe, it, expect } from "vitest";
import { hasPermission } from "../utils/permissions";

describe("hasPermission", () => {
  it("به نقش SUPER_ADMIN با مجوز عام (*) همیشه دسترسی می‌دهد", () => {
    expect(hasPermission(["*"], "requests.manage")).toBe(true);
    expect(hasPermission(["*"], "anything.else")).toBe(true);
  });

  it("وقتی مجوز دقیق در لیست باشد دسترسی می‌دهد", () => {
    expect(hasPermission(["requests.manage", "customers.manage"], "requests.manage")).toBe(true);
  });

  it("وقتی مجوز در لیست نباشد دسترسی نمی‌دهد", () => {
    expect(hasPermission(["requests.manage"], "articles.manage")).toBe(false);
  });

  it("با لیست خالی همیشه دسترسی رد می‌شود", () => {
    expect(hasPermission([], "requests.manage")).toBe(false);
  });
});
