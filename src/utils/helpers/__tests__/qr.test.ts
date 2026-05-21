import { describe, it, expect, vi } from "vitest";
import {
  generateWifiPayload,
  generateDynamicLink,
  generateQRPayload,
  getQRPayload,
  getCategoryLabel,
} from "../qr";
import { EQRCategory } from "@/store";
import { PUBLIC_API_URL, ZALO_APP_DEV_VERSION, ZALO_APP_ID, ZALO_APP_SECRET } from "@/api";

// Mock external dependencies to prevent side effects in Node environment
vi.mock("@/api", () => ({
  PUBLIC_API_URL: PUBLIC_API_URL,
  ZALO_APP_ID: ZALO_APP_ID,
  ZALO_APP_SECRET: ZALO_APP_SECRET,
  ZALO_APP_DEV_VERSION: ZALO_APP_DEV_VERSION,
}));

vi.mock("konva", () => {
  return {
    default: {
      Stage: class {},
      Layer: class {},
      Group: class {},
      Rect: class {},
      Image: class {},
      Text: class {},
    },
  };
});

vi.mock("qr-code-styling", () => {
  return {
    default: class {
      getRawData() {
        return Promise.resolve(new Blob());
      }
    },
  };
});

describe("qr.ts helpers", () => {
  describe("generateWifiPayload", () => {
    it("should format wifi payload correctly", () => {
      const payload = generateWifiPayload("My SSID", "pass123", "WPA");
      expect(payload).toBe("WIFI:S:My SSID;T:WPA;P:pass123;;");
    });

    it("should handle empty password or security", () => {
      const payload = generateWifiPayload("PublicWiFi", "", "nopass");
      expect(payload).toBe("WIFI:S:PublicWiFi;T:nopass;P:;;");
    });
  });

  describe("generateDynamicLink", () => {
    it("should return shortUrl directly if provided", () => {
      const result = generateDynamicLink(
        "1.0.0",
        "qr-id-123",
        EQRCategory.VCARD,
        "https://short.url/123",
      );
      expect(result).toBe("https://short.url/123");
    });

    it("should generate greetings page link for EQRCategory.GREETING", () => {
      const result = generateDynamicLink("28", "greeting-id-456", EQRCategory.GREETING);
      expect(result).toBe(
        "https://zalo.me/s/397281302351627748/?env=TESTING&version=28&page=greetings/greeting-id-456",
      );
    });

    it("should generate vcards page link for other categories (e.g. VCARD)", () => {
      const result = generateDynamicLink("28", "vcard-id-789", EQRCategory.VCARD);
      expect(result).toBe(
        "https://zalo.me/s/397281302351627748/?env=TESTING&version=28&page=vcards/vcard-id-789",
      );
    });
  });

  describe("generateQRPayload", () => {
    it("should generate banking payload correctly", () => {
      const qrMock = {
        id: "qr-123",
        category: EQRCategory.BANKING,
        payload: {
          bankingData: {
            bankId: "970415",
            accountNo: "123456",
            amount: "10000",
            accountName: "TEST USER",
          },
        },
      } as any;

      const payload = generateQRPayload(qrMock);
      expect(payload).toContain("970415");
      expect(payload).toContain("123456");
      expect(payload).toContain("540510000"); // Tag 54 - 10000 VND
    });

    it("should generate wifi payload correctly", () => {
      const qrMock = {
        id: "qr-456",
        category: EQRCategory.WIFI,
        payload: {
          wifiData: {
            ssid: "HomeWiFi",
            password: "password123",
            security: "WPA/WPA2",
          },
        },
      } as any;

      const payload = generateQRPayload(qrMock);
      expect(payload).toBe("WIFI:S:HomeWiFi;T:WPA/WPA2;P:password123;;");
    });

    it("should generate greeting link payload correctly", () => {
      const qrMock = {
        id: "greeting-789",
        category: EQRCategory.GREETING,
        payload: {
          greetingData: {
            eventName: "Sinh nhật",
            wishes: "Chúc mừng sinh nhật",
            hasPassword: false,
          },
        },
      } as any;

      const payload = generateQRPayload(qrMock);
      expect(payload).toContain("397281302351627748");
      expect(payload).toContain("page=greetings/greeting-789");
    });
  });

  describe("getQRPayload", () => {
    it("should build wifi payload from form values", () => {
      const formValues = {
        category: EQRCategory.WIFI,
        wifiData: {
          ssid: "OfficeWiFi",
          password: "officepassword",
          security: "WEP",
        },
      } as any;

      const payload = getQRPayload(formValues);
      expect(payload).toBe("WIFI:S:OfficeWiFi;T:WEP;P:officepassword;;");
    });

    it("should build banking payload from form values", () => {
      const formValues = {
        category: EQRCategory.BANKING,
        bankingData: {
          bankId: "970422",
          accountNo: "987654321",
          amount: "20000",
          description: "Tra tien cafe",
        },
      } as any;

      const payload = getQRPayload(formValues);
      expect(payload).toContain("970422");
      expect(payload).toContain("987654321");
      expect(payload).toContain("Tra tien cafe"); // Accents removed
      expect(payload).toContain("540520000"); // Amount tag
    });
  });

  describe("getCategoryLabel", () => {
    it("should return correct Vietnamese labels for categories", () => {
      expect(getCategoryLabel("wifi")).toBe("QR Wifi");
      expect(getCategoryLabel("banking")).toBe("QR Chuyển khoản");
      expect(getCategoryLabel("vcard")).toBe("Danh thiếp điện tử");
      expect(getCategoryLabel("greeting")).toBe("Thiệp điện tử");
    });

    it("should return the key itself if category is unknown", () => {
      expect(getCategoryLabel("unknown-category")).toBe("unknown-category");
    });
  });
});
