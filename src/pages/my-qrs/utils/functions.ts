export const getCategoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    wifi: "QR Wifi",
    banking: "QR Chuyển khoản",
    vcard: "Danh thiếp điện tử",
    greeting: "Thiệp điện tử",
  };
  return labels[cat] || cat;
};
