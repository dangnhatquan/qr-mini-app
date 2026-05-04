import { z } from "zod";
import { EQRType, EQRCategory, EWifiSecurity } from "@/types/qr";

export const wifiSchema = z.object({
  ssid: z.string().min(1, "Vui lòng nhập tên Wifi"),
  password: z.string().optional(),
  security: z.nativeEnum(EWifiSecurity),
});

export const bankingSchema = z.object({
  bankId: z.string().min(1, "Vui lòng chọn ngân hàng"),
  accountNo: z.string().min(1, "Vui lòng nhập số tài khoản"),
  accountName: z.string().optional(),
  amount: z.string().optional(),
  description: z.string().optional(),
});

export const vcardSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  position: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url("Website không hợp lệ").optional().or(z.literal("")),
  socialLinks: z.string().optional(),
  avatar: z.string().optional(),
});

export const greetingCardSchema = z.object({
  eventName: z.string().min(1, "Vui lòng nhập tên sự kiện"),
  wishes: z.string().min(1, "Vui lòng nhập lời chúc"),
  imageUrl: z.string().optional(),
  videoLink: z.string().url("Link video không hợp lệ").optional().or(z.literal("")),
  password: z.string().optional(),
  maxAttempts: z.number().optional(),
});

export const qrFormSchema = z
  .object({
    qrType: z.nativeEnum(EQRType),
    category: z.nativeEnum(EQRCategory),
    wifiData: z.any().optional(),
    bankingData: z.any().optional(),
    vcardData: z.any().optional(),
    greetingData: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.qrType === EQRType.STATIC) {
      if (data.category === EQRCategory.WIFI) {
        const result = wifiSchema.safeParse(data.wifiData || {});
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({ ...issue, path: ["wifiData", ...issue.path] });
          });
        }
      } else if (data.category === EQRCategory.BANKING) {
        const result = bankingSchema.safeParse(data.bankingData || {});
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({ ...issue, path: ["bankingData", ...issue.path] });
          });
        }
      }
    } else if (data.qrType === EQRType.DYNAMIC) {
      if (data.category === EQRCategory.VCARD) {
        const result = vcardSchema.safeParse(data.vcardData || {});
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({ ...issue, path: ["vcardData", ...issue.path] });
          });
        }
      } else if (data.category === EQRCategory.GREETING) {
        const result = greetingCardSchema.safeParse(data.greetingData || {});
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({ ...issue, path: ["greetingData", ...issue.path] });
          });
        }
      }
    }
  });

export type IQRFormValues = z.infer<typeof qrFormSchema>;
