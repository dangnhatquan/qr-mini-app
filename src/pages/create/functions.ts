export const formatVietQR = (
  bankId: string,
  accountNo: string,
  amount?: string,
  description?: string,
) => {
  return `vietqr://${bankId}/${accountNo}?amount=${amount || ""}&desc=${description || ""}`;
};

export const generateShortId = () => {
  return Math.random().toString(36).substring(2, 9);
};
