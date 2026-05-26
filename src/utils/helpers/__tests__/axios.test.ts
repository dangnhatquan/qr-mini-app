import { describe, it, expect } from "vitest";
import { sanitizePayloadUrls } from "../../axios";

describe("sanitizePayloadUrls", () => {
  it("should replace standard S3 URLs with backend serve paths", () => {
    const input = {
      image:
        "https://s3.amazonaws.com/dev-qr-miniapp/uploads/8c93540d-d4db-40a1-9a74-125026a79854.webp?AWSAccessKeyId=AKIAIOSFODNN7EXAMPLE&Signature=vj7thabdbCLhxVHQOKecgQrHAoY%3D&Expires=1700000000",
      elements: [
        {
          id: "sticker-1",
          src: "https://dev-qr-miniapp.s3.ap-southeast-1.amazonaws.com/uploads/123e4567-e89b-12d3-a456-426614174000.webp",
        },
      ],
    };

    const expected = {
      image: "/api/v1/files/serve/8c93540d-d4db-40a1-9a74-125026a79854",
      elements: [
        {
          id: "sticker-1",
          src: "/api/v1/files/serve/123e4567-e89b-12d3-a456-426614174000",
        },
      ],
    };

    expect(sanitizePayloadUrls(input)).toEqual(expected);
  });

  it("should not modify non-S3 URLs or other strings", () => {
    const input = {
      url: "https://zalo.me/s/397281302351627748",
      name: "My QR Code",
      logoFileId: "8c93540d-d4db-40a1-9a74-125026a79854",
    };

    expect(sanitizePayloadUrls(input)).toEqual(input);
  });

  it("should handle string input directly", () => {
    const input =
      "https://s3.amazonaws.com/dev-qr-miniapp/uploads/8c93540d-d4db-40a1-9a74-125026a79854.webp";
    const expected = "/api/v1/files/serve/8c93540d-d4db-40a1-9a74-125026a79854";
    expect(sanitizePayloadUrls(input)).toBe(expected);
  });

  it("should ignore Blob, File, and FormData", () => {
    const blob = new Blob(["hello"], { type: "text/plain" });
    expect(sanitizePayloadUrls(blob)).toBe(blob);
  });
});
