# FE Integration Specs: S3 Presigned URLs

Tài liệu này cung cấp các chỉ dẫn cho đội ngũ Frontend (FE) để tích hợp mượt mà với cơ chế S3 Presigned URL mới của Backend (BE). 

Nhìn chung, Backend đã gánh 95% khối lượng công việc thông qua **Global Interceptor** (tự động biến đổi URL) và **302 Redirect**. Tuy nhiên, FE cần lưu ý một số điểm cực kỳ quan trọng dưới đây để tránh lỗi hỏng ảnh sau 1 giờ (do hết hạn URL).

---

## 1. Cơ chế hiển thị ảnh (Render)
**FE KHÔNG CẦN LÀM GÌ CẢ.**
- Các biến hằng số (constants) như `ZAPY_STICKERS`, `BU_MAT_NGAO` chứa đường dẫn dạng `/api/v1/files/serve/:id` vẫn tiếp tục hoạt động bình thường. Trình duyệt sẽ tự động handle 302 Redirect tới S3.
- Các API trả về dữ liệu động (VD: Get QR Code Detail, Get Card Detail) sẽ tự động chứa đường dẫn S3 Presigned URL trực tiếp (`https://s3.amazonaws.com/...`) trong response payload. Trình duyệt cứ thế lấy link đó để render vào thẻ `<img>` hoặc Canvas, không tốn thêm request phụ.

---

## 2. Cơ chế Lưu dữ liệu (Save/Update) - ⚠️ QUAN TRỌNG
Đây là điểm duy nhất FE cần chú ý và can thiệp code.

### Vấn đề:
Khi gọi API lấy chi tiết QR Code/Card, BE trả về URL S3 có thời hạn (expires). Nếu user chỉnh sửa và bấm **Save**, nếu FE bê nguyên cái cục state chứa URL S3 đó gởi ngược lên BE, BE sẽ lưu cái URL hết hạn đó vào Database. **Hậu quả là sau 1 tiếng, ảnh đó sẽ bị lỗi (Access Denied).**

### Giải pháp yêu cầu cho FE:
Khi gọi các API `POST` hoặc `PATCH` để lưu dữ liệu (như lưu Editor Stage, Cập nhật Card...), FE **TỤYỆT ĐỐI KHÔNG ĐƯỢC** gửi URL của S3 lên BE. FE phải format lại URL ảnh về dạng chuẩn trước khi submit.

**Cách xử lý:**
Dạng chuẩn mà BE chấp nhận lưu vào DB là dạng ID hoặc dạng path nội bộ: `/api/v1/files/serve/{fileId}`.

**Bước 1: Khi Upload file mới**
- Khi gọi `POST /api/v1/files/upload`, API sẽ trả về object `file: { id: "...", path: "https://s3..." }`.
- Thay vì dùng `file.path` để lưu vào payload gửi lên BE sau này, FE hãy tự tạo chuỗi chuẩn từ `file.id`:
  ```javascript
  const standardPath = `/api/v1/files/serve/${response.data.file.id}`;
  // Dùng standardPath để lưu vào Editor State nội bộ của FE
  ```

**Bước 2: Chuẩn hoá payload trước khi Save (Sanitize)**
- Trước khi gọi API save dữ liệu, FE có thể chạy một hàm đệ quy (recursive) duyệt qua cục JSON payload (VD: `editorStage`).
- Nếu thấy bất kỳ chuỗi URL nào bắt đầu bằng `https://s3.amazonaws.com/...`, FE cần bóc tách cái `fileId` từ trong URL đó ra và đổi nó thành dạng `/api/v1/files/serve/{fileId}`.
- *Mẹo:* Trong URL của AWS S3, tên file thường chính là `fileId`. Ví dụ đường dẫn S3 sẽ có đoạn `.../uploads/123e4567-e89b-12d3-a456-426614174000.webp?...`. FE có thể dùng Regex để tìm đoạn UUID này.

**Đoạn code Regex tiện ích gợi ý cho FE:**
```javascript
const sanitizePayloadUrls = (payload) => {
  const payloadStr = JSON.stringify(payload);
  
  // Tìm tất cả các URL S3 có chứa UUID và biến chúng thành dạng path nội bộ của BE
  // Regex này tìm UUID chuẩn: 8-4-4-4-12 ký tự hex
  const uuidRegex = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/gi;
  
  // Hàm replace này sẽ thay thế nguyên cái chuỗi URL S3 dài ngoằng thành path tĩnh
  const sanitizedStr = payloadStr.replace(/https:\/\/s3\.[^\s"']+/g, (match) => {
    const ids = match.match(uuidRegex);
    if (ids && ids.length > 0) {
      // Lấy UUID cuối cùng trong URL (chính là tên file)
      const fileId = ids[ids.length - 1]; 
      return `/api/v1/files/serve/${fileId}`;
    }
    return match; // Trả về nguyên gốc nếu không tìm thấy ID
  });

  return JSON.parse(sanitizedStr);
};

// Gọi trước khi submit
const payloadToSubmit = sanitizePayloadUrls(editorStage);
```

---

## 3. Quản lý Cache của Browser
Đối với các ảnh được load từ `/api/v1/files/serve/:id` (như Sticker, Template), BE đã thiết lập header `Cache-Control: public, max-age=3600`. FE không cần thiết lập thêm thủ thuật cache nào ở phía client. 

## 4. Xử lý Lỗi Hết Hạn (Expiration) ở Client-side
S3 Presigned URL được cấu hình hết hạn sau 1 giờ. 
Thông thường, user ít khi treo trình duyệt mở 1 trang chỉnh sửa quá 1 giờ liên tục mà không reload. Tuy nhiên, nếu xảy ra trường hợp ảnh bị lỗi (load thất bại do hết hạn `403 Forbidden`):
- FE có thể thiết lập sự kiện `onError` cho các thẻ `<img>` quan trọng. 
- Khi ảnh lỗi do 403, FE chỉ cần lấy lại data mới từ BE (hoặc đơn giản là báo user refresh lại trang) để lấy chùm Presigned URL mới. 
