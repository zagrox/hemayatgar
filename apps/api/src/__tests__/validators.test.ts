import { describe, it, expect } from "vitest";
import { isValidIranianMobile } from "../utils/validators";

describe("isValidIranianMobile", () => {
  it("شماره موبایل معتبر را قبول می‌کند", () => {
    expect(isValidIranianMobile("09123456789")).toBe(true);
    expect(isValidIranianMobile("09351234567")).toBe(true);
  });

  it("شماره‌های نامعتبر را رد می‌کند", () => {
    expect(isValidIranianMobile("0912345678")).toBe(false); // کوتاه
    expect(isValidIranianMobile("9123456789")).toBe(false); // بدون صفر ابتدایی
    expect(isValidIranianMobile("+989123456789")).toBe(false);
    expect(isValidIranianMobile("مثلا یک متن")).toBe(false);
  });
});
