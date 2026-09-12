/**
 * لایه آماده برای اتصال آینده به API بیمه ایران.
 *
 * طبق دستور پروژه، در حال حاضر هیچ اتصال واقعی به API بیمه ایران پیاده‌سازی
 * نشده است. این فایل فقط اینترفیس و ساختار قرارداد (contract) را آماده می‌کند
 * تا وقتی کلیدها و مستندات API از سوی بیمه ایران در اختیار قرار گرفت، پیاده‌سازی
 * واقعی بدون نیاز به تغییر در بقیه پروژه اضافه شود.
 */

export interface IranInsuranceClientConfig {
  baseUrl: string;
  apiKey: string;
  agencyCode: string; // 9968
}

export interface IranInsurancePremiumInquiryRequest {
  insuranceType: string;
  nationalId: string;
  // فیلدهای بیشتر بر اساس مستندات رسمی API بیمه ایران در آینده اضافه می‌شود
}

export interface IranInsurancePremiumInquiryResponse {
  premiumAmount: number;
  currency: "IRR";
  validUntil: string;
}

/**
 * کلاینت آماده برای آینده — در حال حاضر عمداً پیاده‌سازی نشده است.
 * هر متد فقط خطای "هنوز پیاده‌سازی نشده" برمی‌گرداند تا فراخوانی اشتباهی
 * در این فاز از پروژه به‌سادگی قابل تشخیص باشد.
 */
export class IranInsuranceClient {
  constructor(private readonly config: IranInsuranceClientConfig) {}

  async inquirePremium(
    _request: IranInsurancePremiumInquiryRequest,
  ): Promise<IranInsurancePremiumInquiryResponse> {
    throw new Error(
      "اتصال به API بیمه ایران هنوز پیاده‌سازی نشده است. این متد فقط ساختار آینده را نشان می‌دهد.",
    );
  }
}
