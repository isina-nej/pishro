import { z } from "zod";

const optionalString = z.string().optional().nullable();
const optionalNumber = z.number().optional().nullable();
const jsonValue = z.unknown().optional();

export const HomeLandingUpsertSchema = z.object({
  mainHeroTitle: optionalString,
  mainHeroSubtitle: optionalString,
  mainHeroCta1Text: optionalString,
  mainHeroCta1Link: optionalString,
  heroTitle: z.string().min(1, "عنوان هیرو الزامی است"),
  heroSubtitle: optionalString,
  heroDescription: optionalString,
  heroVideoUrl: optionalString,
  heroCta1Text: optionalString,
  heroCta1Link: optionalString,
  overlayTexts: jsonValue,
  statsData: jsonValue,
  whyUsTitle: optionalString,
  whyUsDescription: optionalString,
  whyUsItems: jsonValue,
  newsClubTitle: optionalString,
  newsClubDescription: optionalString,
  calculatorTitle: optionalString,
  calculatorDescription: optionalString,
  calculatorRateLow: optionalNumber,
  calculatorRateMedium: optionalNumber,
  calculatorRateHigh: optionalNumber,
  calculatorPortfolioLowDesc: optionalString,
  calculatorPortfolioMediumDesc: optionalString,
  calculatorPortfolioHighDesc: optionalString,
  calculatorAmountSteps: jsonValue,
  calculatorDurationSteps: jsonValue,
  calculatorInPersonPhone: optionalString,
  calculatorOnlineTelegram: optionalString,
  calculatorOnlineTelegramLink: optionalString,
  metaTitle: optionalString,
  metaDescription: optionalString,
  metaKeywords: jsonValue,
  published: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const HomeLandingUpdateSchema = HomeLandingUpsertSchema.partial().extend({
  heroTitle: z.string().min(1, "عنوان هیرو الزامی است").optional(),
});

export const HomeSlideUpsertSchema = z.object({
  title: z.string().min(1, "عنوان اسلاید الزامی است"),
  description: optionalString,
  imageUrl: z.string().min(1, "آدرس تصویر الزامی است"),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const HomeSlideUpdateSchema = HomeSlideUpsertSchema.partial();

export const HomeMiniSliderUpsertSchema = z.object({
  imageUrl: z.string().min(1, "آدرس تصویر الزامی است"),
  row: z.number().int().min(1).max(2).optional(),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const HomeMiniSliderUpdateSchema = HomeMiniSliderUpsertSchema.partial();

const mobilePageUrlSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "آدرس صفحه باید مسیر داخلی (مثل /courses) یا لینک http(s) باشد"
  );

function refineMobileScrollerContent(
  data: {
    contentType?: "IMAGE" | "PAGE";
    imageUrl?: string | null;
    pageUrl?: string | null;
  },
  ctx: z.RefinementCtx,
  opts: { requireContent: boolean }
) {
  const type = data.contentType ?? "IMAGE";
  if (type === "PAGE") {
    if (!data.pageUrl || !String(data.pageUrl).trim()) {
      if (opts.requireContent || data.contentType === "PAGE") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pageUrl"],
          message: "برای نوع «صفحه سایت» آدرس صفحه الزامی است",
        });
      }
      return;
    }
    const parsed = mobilePageUrlSchema.safeParse(data.pageUrl);
    if (!parsed.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pageUrl"],
        message: parsed.error.issues[0]?.message || "آدرس صفحه نامعتبر است",
      });
    }
    return;
  }

  if (
    opts.requireContent &&
    (!data.imageUrl || !String(data.imageUrl).trim())
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["imageUrl"],
      message: "برای نوع «تصویر» آدرس تصویر داخل موبایل الزامی است",
    });
  }
}

const MobileScrollerStepBaseSchema = z.object({
  stepNumber: z.number().int().min(1, "شماره قدم الزامی است"),
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().min(1, "توضیحات الزامی است"),
  contentType: z.enum(["IMAGE", "PAGE"]).optional(),
  imageUrl: optionalString,
  pageUrl: optionalString,
  coverImageUrl: optionalString,
  gradient: optionalString,
  link: optionalString,
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const MobileScrollerStepUpsertSchema = MobileScrollerStepBaseSchema.superRefine(
  (data, ctx) => refineMobileScrollerContent(data, ctx, { requireContent: true })
);

export const MobileScrollerStepUpdateSchema = MobileScrollerStepBaseSchema.partial().superRefine(
  (data, ctx) => {
    if (data.contentType === "PAGE" || data.pageUrl != null) {
      refineMobileScrollerContent(
        { contentType: data.contentType ?? "PAGE", pageUrl: data.pageUrl, imageUrl: data.imageUrl },
        ctx,
        { requireContent: Boolean(data.contentType === "PAGE") }
      );
    }
  }
);

export const AboutPageUpsertSchema = z.object({
  heroTitle: z.string().min(1, "عنوان هیرو الزامی است"),
  heroSubtitle: optionalString,
  heroDescription: optionalString,
  heroBadgeText: optionalString,
  doctorIntroVideoUrl: optionalString,
  heroStats: jsonValue,
  resumeTitle: optionalString,
  resumeSubtitle: optionalString,
  teamTitle: optionalString,
  teamSubtitle: optionalString,
  certificatesTitle: optionalString,
  certificatesSubtitle: optionalString,
  newsTitle: optionalString,
  newsSubtitle: optionalString,
  ctaTitle: optionalString,
  ctaDescription: optionalString,
  ctaButtonText: optionalString,
  ctaButtonLink: optionalString,
  metaTitle: optionalString,
  metaDescription: optionalString,
  metaKeywords: jsonValue,
  published: z.boolean().optional(),
});
export const AboutPageUpdateSchema = AboutPageUpsertSchema.partial().extend({
  heroTitle: z.string().min(1).optional(),
});

export const ResumeItemUpsertSchema = z.object({
  aboutPageId: z.string().min(1, "شناسه صفحه درباره ما الزامی است"),
  icon: optionalString,
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().min(1, "توضیحات الزامی است"),
  color: optionalString,
  bgColor: optionalString,
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const ResumeItemUpdateSchema = ResumeItemUpsertSchema.partial();

export const TeamMemberUpsertSchema = z.object({
  aboutPageId: z.string().min(1, "شناسه صفحه درباره ما الزامی است"),
  name: z.string().min(1, "نام الزامی است"),
  role: z.string().min(1, "نقش الزامی است"),
  image: optionalString,
  education: optionalString,
  description: optionalString,
  specialties: jsonValue,
  linkedinUrl: optionalString,
  emailUrl: optionalString,
  twitterUrl: optionalString,
  whatsappUrl: optionalString,
  telegramUrl: optionalString,
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const TeamMemberUpdateSchema = TeamMemberUpsertSchema.partial();

export const CertificateUpsertSchema = z.object({
  aboutPageId: z.string().min(1, "شناسه صفحه درباره ما الزامی است"),
  title: z.string().min(1, "عنوان الزامی است"),
  description: optionalString,
  image: z.string().min(1, "آدرس تصویر الزامی است"),
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const CertificateUpdateSchema = CertificateUpsertSchema.partial();

export const BusinessConsultingUpsertSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().min(1, "توضیحات الزامی است"),
  image: optionalString,
  phoneNumber: optionalString,
  telegramId: optionalString,
  telegramLink: optionalString,
  coursesLink: optionalString,
  inPersonTitle: optionalString,
  inPersonDescription: optionalString,
  onlineTitle: optionalString,
  onlineDescription: optionalString,
  coursesTitle: optionalString,
  coursesDescription: optionalString,
  metaTitle: optionalString,
  metaDescription: optionalString,
  metaKeywords: jsonValue,
  published: z.boolean().optional(),
});
export const BusinessConsultingUpdateSchema = BusinessConsultingUpsertSchema.partial();

export const InvestmentPlansUpsertSchema = z.object({
  title: z.string().min(1, "عنوان الزامی است"),
  description: z.string().min(1, "توضیحات الزامی است"),
  image: optionalString,
  plansIntroCards: jsonValue,
  minAmount: z.number().int().optional(),
  maxAmount: z.number().int().optional(),
  amountStep: z.number().int().optional(),
  metaTitle: optionalString,
  metaDescription: optionalString,
  metaKeywords: jsonValue,
  published: z.boolean().optional(),
});
export const InvestmentPlansUpdateSchema = InvestmentPlansUpsertSchema.partial();

export const InvestmentPlanItemUpsertSchema = z.object({
  investmentPlansId: z.string().min(1, "شناسه صفحه سبدها الزامی است"),
  label: z.string().min(1, "برچسب الزامی است"),
  icon: optionalString,
  description: optionalString,
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const InvestmentPlanItemUpdateSchema = InvestmentPlanItemUpsertSchema.partial();

export const InvestmentTagUpsertSchema = z.object({
  investmentPlansId: z.string().min(1, "شناسه صفحه سبدها الزامی است"),
  title: z.string().min(1, "عنوان تگ الزامی است"),
  color: optionalString,
  icon: optionalString,
  order: z.number().int().optional(),
  published: z.boolean().optional(),
});
export const InvestmentTagUpdateSchema = InvestmentTagUpsertSchema.partial();
