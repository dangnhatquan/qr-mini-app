import { removeVietnameseTones } from "./common";

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export function generateVietQRPayload({
  bankId,
  accountNumber,
  amount,
  merchantName = "N/A",
  merchantCity = "VIETNAM",
  description = "",
}: {
  bankId: string;
  accountNumber: string;
  amount?: string;
  merchantName?: string;
  merchantCity?: string;
  description?: string;
}) {
  if (!bankId) throw new Error("Bank BIN không được để trống");
  if (!accountNumber) throw new Error("Số tài khoản không được để trống");

  const tlv = (id: string, value: string) => {
    const v = String(value);
    const len = v.length.toString().padStart(2, "0");
    return `${id}${len}${v}`;
  };

  const consumerInfo = tlv("00", bankId) + tlv("01", accountNumber);
  const napasProvider = tlv("00", "A000000727") + tlv("01", consumerInfo) + tlv("02", "QRIBFTTC");

  let payload = "";
  payload += tlv("00", "01");
  payload += tlv("01", "11");
  payload += tlv("38", napasProvider);
  payload += tlv("53", "704");
  if (amount) {
    payload += tlv("54", amount);
    payload = payload.replace(tlv("01", "11"), tlv("01", "12"));
  }
  payload += tlv("58", "VN");
  payload += tlv("59", merchantName);
  payload += tlv("60", merchantCity);

  if (description) {
    const addData = tlv("08", removeVietnameseTones(description));
    payload += tlv("62", addData);
  }

  payload += "6304";
  const crcValue = crc16(payload);
  return payload + crcValue;
}
