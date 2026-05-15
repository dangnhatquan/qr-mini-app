export const viTranslations = {
  errors: {
    INTERNAL_SERVER_ERROR: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
    BAD_REQUEST: "Yêu cầu không hợp lệ.",
    NOT_FOUND: "Không tìm thấy tài nguyên.",
    VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
    UNAUTHORIZED: "Vui lòng đăng nhập để tiếp tục.",
    FORBIDDEN: "Bạn không có quyền thực hiện hành động này.",
    INVALID_PASSWORD: "Mật khẩu không hợp lệ.",
    INCORRECT_PASSWORD: "Mật khẩu không chính xác.",
    USER_NOT_FOUND: "Không tìm thấy người dùng.",
    USER_INACTIVE: "Tài khoản người dùng đã bị khóa.",
    EMAIL_ALREADY_EXISTS: "Email này đã được sử dụng.",
    EMAIL_NOT_EXISTS: "Email không tồn tại.",
    TOKEN_EXPIRED: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.",
    INVALID_TOKEN: "Mã xác thực không hợp lệ.",
    INVALID_HASH: "Liên kết không hợp lệ hoặc đã hết hạn.",
    NEED_LOGIN_VIA_PROVIDER: "Tài khoản này yêu cầu đăng nhập qua mạng xã hội.",
    FILE_TOO_LARGE: "Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn (tối đa 5MB).",
    FILE_NOT_FOUND: "Không tìm thấy tệp.",
    FILE_REQUIRED: "Vui lòng chọn tệp để tải lên.",
    QR_NOT_FOUND: "Không tìm thấy mã QR.",
  },
};

export const t = (key: string): string => {
  const keys = key.split(".");
  let result: any = viTranslations;
  for (const k of keys) {
    result = result?.[k];
  }
  return typeof result === "string" ? result : key;
};
