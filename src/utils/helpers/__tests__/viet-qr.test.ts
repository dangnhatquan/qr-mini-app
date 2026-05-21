import { describe, it, expect } from "vitest";
import { generateVietQRPayload } from "../viet-qr";

describe("generateVietQRPayload", () => {
  it("should throw an error if bankId is empty", () => {
    expect(() =>
      generateVietQRPayload({
        bankId: "",
        accountNumber: "123456789",
      }),
    ).toThrow("Bank BIN không được để trống");
  });

  it("should throw an error if accountNumber is empty", () => {
    expect(() =>
      generateVietQRPayload({
        bankId: "970415",
        accountNumber: "",
      }),
    ).toThrow("Số tài khoản không được để trống");
  });

  it("should generate a valid VietQR payload with default values", () => {
    const payload = generateVietQRPayload({
      bankId: "970415",
      accountNumber: "123456789",
    });

    // Check basic structural tags
    expect(payload).toContain("000201"); // Tag 00 - Payload Format Indicator (value "01")
    expect(payload).toContain("010211"); // Tag 01 - Point of Initiation Method (value "11" - Static QR)

    // Tag 38 - Merchant Account Information (NAPAS info)
    // napasProvider has Tag 00 (A000000727), Tag 01 (consumerInfo), Tag 02 (QRIBFTTC)
    // consumerInfo has Tag 00 (bankId: 970415), Tag 01 (accountNumber: 123456789)
    expect(payload).toContain("38"); // Tag 38 should exist
    expect(payload).toContain("A000000727"); // NAPAS AID
    expect(payload).toContain("970415"); // Bank BIN
    expect(payload).toContain("123456789"); // Account No

    expect(payload).toContain("5303704"); // Tag 53 - Transaction Currency (value "704" for VND)
    expect(payload).toContain("5802VN"); // Tag 58 - Country Code (value "VN")
    expect(payload).toContain("5903N/A"); // Tag 59 - Merchant Name (value "N/A" as default)
    expect(payload).toContain("6007VIETNAM"); // Tag 60 - Merchant City (value "VIETNAM" as default)

    // Tag 63 - CRC checksum (length 4) at the end
    expect(payload.slice(-8, -4)).toBe("6304");
    expect(payload.length).toBeGreaterThan(8);
  });

  it("should format Point of Initiation Method as '12' (Dynamic QR) and add Tag 54 when amount is provided", () => {
    const payload = generateVietQRPayload({
      bankId: "970415",
      accountNumber: "123456789",
      amount: "50000",
    });

    expect(payload).toContain("010212"); // Should be '12' (Dynamic QR with amount)
    expect(payload).toContain("540550000"); // Tag 54 - Transaction Amount (value "50000")
  });

  it("should remove Vietnamese tones and add Tag 62 when description is provided", () => {
    const payload = generateVietQRPayload({
      bankId: "970415",
      accountNumber: "123456789",
      description: "Thanh toán hoá đơn",
    });

    // "Thanh toán hoá đơn" normalized without tones is "Thanh toan hoa don"
    // Len of "Thanh toan hoa don" is 18. Tag 62 contains Tag 08 (additional data)
    // Tag 08 length is 18, value "Thanh toan hoa don" => "0818Thanh toan hoa don"
    expect(payload).toContain("Thanh toan hoa don");
    expect(payload).not.toContain("Thanh toán hoá đơn");
    expect(payload).toContain("62220818Thanh toan hoa don"); // Tag 62 length 22 (2 for tag "08" + 2 for length "18" + 18 for "Thanh toan hoa don")
  });

  it("should calculate correct CRC16 checksum", () => {
    // Let's verify CRC16 calculations are consistent
    const payload1 = generateVietQRPayload({
      bankId: "970415",
      accountNumber: "123456789",
    });

    const payload2 = generateVietQRPayload({
      bankId: "970415",
      accountNumber: "123456789",
    });

    // Checksums should be deterministic
    expect(payload1).toBe(payload2);

    // The last 4 characters are the checksum
    const crc = payload1.slice(-4);
    expect(crc).toMatch(/^[0-9A-F]{4}$/);
  });
});
