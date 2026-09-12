export const IRANIAN_MOBILE_REGEX = /^09\d{9}$/;

export function isValidIranianMobile(mobile: string): boolean {
  return IRANIAN_MOBILE_REGEX.test(mobile);
}
