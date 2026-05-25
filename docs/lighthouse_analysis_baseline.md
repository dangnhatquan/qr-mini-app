# Phân Tích Kết Quả Chạy Lighthouse Baseline (Before Optimize)

Tài liệu này lưu lại kết quả đo lường hiệu năng ban đầu (Baseline) từ hai lượt chạy thử nghiệm Lighthouse ở chế độ Development:
1. **Lượt 1 (Có Cache):** Báo cáo [localhost_3000-20260524T202049.json](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/docs/localhost_3000-20260524T202049.json).
2. **Lượt 2 (Disable Cache + Fast 4G):** Báo cáo [localhost_3000-2026052. T211459.json](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/docs/localhost_3000-2026052.%20T211459.json).

---

## 📊 Bảng Chỉ số Tổng quan (Baseline Performance)

| Chỉ số | Lượt 1 (Có Cache) | Lượt 2 (Disable Cache + Fast 4G) | Điểm số Lượt 2 | Đánh giá (Lượt 2) |
|---|---|---|---|---|
| **Lighthouse Performance Score** | **75** / 100 | **54** / 100 | - | Cần cải thiện (Needs Improvement) |
| **LCP (Largest Contentful Paint)** | **2.4 s** | **5.1 s** | 0.24 | **Tệ (Poor > 4.0s)** |
| **FCP (First Contentful Paint)** | **2.3 s** | **3.9 s** | 0.26 | Cần cải thiện (Needs Improvement < 1.8s) |
| **TBT (Total Blocking Time)** | **370 ms** | **340 ms** | 0.74 | Cần cải thiện (Needs Improvement < 200ms) |
| **CLS (Cumulative Layout Shift)** | **0.09** | **0.09** | 0.92 | Tốt (Good < 0.1) |
| **Speed Index (SI)** | **13.4 s** | **13.3 s** | 0.02 | **Tệ (Poor > 5.8s)** |

---

## 📋 Bảng So Sánh Trước & Sau Tối Ưu Hóa (Before vs After Comparison Dashboard)

> [!NOTE]
> Bảng này được sử dụng làm trung tâm đối chiếu chỉ số đo lường trước (Before) và sau khi áp dụng tối ưu hóa (After) để báo cáo hiệu năng. Cột **Sau tối ưu (After)** sẽ được cập nhật sau khi hoàn thành code optimization.

### 1. Bảng Chỉ số Hiệu năng & Trải nghiệm Người dùng (UX & Performance Metrics)

| Loại đo lường | Chỉ số đo | Trước tối ưu (Before) | Sau tối ưu (After) | Mục tiêu (Target) | Nguồn/Cách đo |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Lighthouse (Dev mode)** | Performance Score | **54 / 100** | *TBD* | **> 80** | Lighthouse (No Cache + Fast 4G) |
| | LCP (Largest Contentful Paint) | **5.1 s** | *TBD* | **< 2.5 s** | Lighthouse (No Cache + Fast 4G) |
| | FCP (First Contentful Paint) | **3.9 s** | *TBD* | **< 1.8 s** | Lighthouse (No Cache + Fast 4G) |
| | TBT (Total Blocking Time) | **340 ms** | *TBD* | **< 200 ms** | Lighthouse (No Cache + Fast 4G) |
| | CLS (Cumulative Layout Shift) | **0.09** | *TBD* | **< 0.05** | Lighthouse (No Cache + Fast 4G) |
| | Speed Index (SI) | **13.3 s** | *TBD* | **< 4.0 s** | Lighthouse (No Cache + Fast 4G) |
| **Tương tác thực tế (RUM)** | INP (Chuyển trang/Lưu Editor) | **232 ms** | *TBD* | **< 100 ms** | Field Data (Zalo Simulator / Slow 4G) |
| | CLS (Modal & Spinner) | **0.316** | *TBD* | **< 0.1** | Field Data (Zalo Simulator / Slow 4G) |
| | LCP thực tế (Modal Focus QR) | **10.6 s** | *TBD* | **< 2.0 s** | Field Data (Zalo Simulator / Slow 4G) |
| | INP khi nhập Form | **56 - 112 ms** | *TBD* | **< 50 ms** | Field Data (Zalo Simulator / Slow 4G) |

### 2. Các điểm nghẽn kỹ thuật chính & Chỉ số React Profiler (React Render / Commit Bottlenecks)

| Điểm nghẽn phát hiện | Tệp tin / Component | Chỉ số Trước (Before) | Giải pháp Tối ưu | Mục tiêu Sau (After) |
| :--- | :--- | :---: | :--- | :---: |
| **Vẽ SVG QR Code đồng bộ** | [qr-display.tsx](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/components/qr-display.tsx) | **28 - 34 ms** / card<br>**(240ms tổng cộng)** | Áp dụng **IntersectionObserver** để lazy render QR Code | **< 5 ms** / card |
| **Nghẽn luồng render trang chính** | [my-qrs/index.tsx](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/pages/my-qrs/index.tsx) | Commit Render: **241.3 ms**<br>Passive Effect: **286.7 ms** | Kết hợp Lazy Render + Trì hoãn gọi API (`setTimeout 200ms`) | Commit Render: **< 16 ms**<br>Effect: **< 30 ms** |
| **Giật khung hình transition** | [my-qrs/index.tsx](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/pages/my-qrs/index.tsx) | `CSSTransition` dropped frames liên tiếp | Trì hoãn dọn dẹp DOM và render danh sách cho đến khi transition xong | Triệt tiêu hoàn toàn dropped frames |
| **Khởi tạo Editor & Canvas nặng** | `QREditor` (Konva / Canvas) | Render: **51.1 ms**<br>Passive Effect: **36.6 ms** | Dịch chuyển trang Editor thành **Lazy Component (`React.lazy`)** | Trì hoãn hoàn toàn lúc khởi động |
| **Dịch chuyển layout do Spinner** | [my-qrs/index.tsx](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/pages/my-qrs/index.tsx) | Thực tế CLS: **0.316** | Xây dựng **Skeleton Screen** cố định kích thước làm placeholder | **CLS < 0.05** |

---

## 🔍 Phân Tích Các Vấn Đề Gây Nghẽn Hiệu Năng

### 1. Thử nghiệm trên môi trường Development (`localhost:3000` / `localhost:2999`)
*   **Vấn đề:** 
    Lighthouse được chạy trực tiếp trên môi trường dev local. Ở môi trường này, Vite không đóng gói (bundle) hay nén (minify) code, đồng thời React chạy ở chế độ dev-mode để thuận tiện debug.
*   **Hậu quả:** 
    *   Trình duyệt phải tải hàng loạt file JS lớn chưa nén: `react-dom.development.js` (909 KB), `react-konva.js` (682 KB), `lottie-react.js` (679 KB), `zmp-ui.js` (605 KB).
    *   **Lượt 1 (Có Cache):** Mặc dù các file đã được lưu trong cache, điểm số vẫn bị ảnh hưởng nhẹ và Speed Index lên tới **13.4s**.
    *   **Lượt 2 (Disable Cache + Fast 4G):** Khi không có cache để cứu cánh, hậu quả của việc load các file JS thô (tổng cộng ~2.8MB) lộ rõ trên đường truyền di động mô phỏng: **FCP tăng vọt lên 3.9s** và **LCP tăng vọt lên 5.1s**, kéo tổng điểm Performance tụt xuống còn **54**.
*   **Khuyến nghị:** Cần đo lại trên bản build production (`www` folder) để có chỉ số Speed Index và LCP thực tế của người dùng.


### 2. Render-blocking CSS từ CDN ngoài
*   **Vấn đề:** 
    Đường link CSS Font Awesome (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css`) chặn quá trình render ban đầu của trang web.
*   **Hậu quả:** 
    *   Trình duyệt phải đợi tải và phân tích file CSS này trước khi vẽ giao diện lên màn hình.
    *   Lighthouse ước tính việc này làm **lãng phí mất 1.46s (wastedMs)** và làm chậm LCP/FCP khoảng **750ms**.
*   **Khuyến nghị:** 
    *   Thay thế Font Awesome CDN bằng các thư viện SVG inline (như `@tabler/icons-react` đã cài sẵn) để giảm thiểu CSS bên ngoài.
    *   Nếu vẫn cần dùng Font Awesome, hãy tải trực tiếp local hoặc sử dụng `<link rel="preload">` / `dns-prefetch`.

### 3. Total Blocking Time (TBT) cao (370ms)
*   **Vấn đề:**
    JS chính chạy nặng, block Main Thread của trình duyệt lúc khởi tạo. Do kích thước bundle lớn của các thư viện đồ họa (`react-konva`, `lottie-react`) chạy đồng thời ngay lúc khởi tạo.
*   **Khuyến nghị:**
    *   Áp dụng **Lazy Loading** (`React.lazy` và `Suspense`) cho các màn hình hoặc component phức tạp (như Editor, Canvas QR, VCard Detail, Lottie) để trì hoãn load các bundle nặng này cho đến khi người dùng điều hướng tới.

### 4. Layout Shift (CLS = 0.09) sát ngưỡng giới hạn
*   **Vấn đề:**
    Chỉ số CLS gần chạm mức đỏ (0.1) chứng tỏ có sự thay đổi vị trí của các element khi trang web load. Khả năng cao do font/icon CDN load chậm gây giật font hoặc image/canvas chưa có kích thước placeholder cố định.
*   **Khuyến nghị:**
    *   Khai báo thuộc tính `width`, `height` hoặc sử dụng tỷ lệ khung hình (aspect-ratio) cố định làm placeholder cho vùng vẽ QR/Canvas.

---

## 📊 Kết Quả Đo Lường Tương Tác Thực Tế (Field Data / RUM)

Dưới đây là các số liệu thu được khi thực hiện thao tác thủ công trên Zalo DevTools Simulator (mạng giả lập **Slow 4G**):

### Bảng chỉ số tương tác thực tế

| Chỉ số | Kết quả đo được | Trạng thái (Ngưỡng Google) | Hành động trigger |
|---|---|---|---|
| **INP (Interaction to Next Paint)** | **232 ms** | Cần cải thiện (Needs Imp. < 200ms) | Lưu thiết kế ở trang QR Editor và quay về trang `my-qrs` |
| **INP (khi gõ Form nhập liệu)** | **56 ms - 112 ms** | Tốt (Good < 200ms) | Gõ thông tin WiFi/Tên gợi nhớ vào các ô input |
| **CLS (Cumulative Layout Shift)** | **0.316** | **Tệ (Poor > 0.25)** | Khi hiển thị Modal `QRFocusView` / chuyển đổi từ Spinner sang List QR |
| **LCP (Largest Contentful Paint)** | **10,668 ms** | **Tệ (Poor > 4.0s)** | Khi click mở thẻ QR phóng to trong `QRFocusView` |

---

## 🔍 Phân Tích Chi Tiết Hiệu Năng Tương Tác Thực Tế

### 1. Chỉ số INP cao (232ms) khi thoát/lưu từ Editor về trang chính
*   **Nguyên nhân:** 
    Khi bấm nút Save (nút Check xanh trong Editor) hoặc nút Back, trình duyệt phải xử lý đồng thời 2 tác vụ CPU nặng:
    1.  **Unmount QREditor (react-konva):** Konva Stage dọn dẹp các canvas layer, group, shapes và transformer. Đây là tác vụ đồng bộ chiếm dụng nhiều tài nguyên.
    2.  **Mount MyQRsPage & gọi API lập tức:** Trang danh sách QR khi vừa mount lập tức kích hoạt `fetchQRRecords()` và `fetchBanks()` trong `useEffect` để tải danh sách mã QR và ngân hàng. Tác vụ re-render giao diện (hiển thị Spinner) và khởi chạy API diễn ra đúng lúc router đang chạy hiệu ứng trượt chuyển trang (slide transition) làm nghẽn Main Thread mất 232ms.
*   **Khuyến nghị:** Trì hoãn việc gọi API ở `MyQRsPage` khoảng `200ms` bằng `setTimeout` để dành toàn bộ tài nguyên cho hiệu ứng chuyển trang của Router hoàn tất trước.

### 2. CLS tăng vọt lên 0.316 (Trạng thái Đỏ - Poor)
*   **Nguyên nhân:**
    1.  **Thay thế giao diện đột ngột:** Khi chuyển trạng thái từ màn hình Loading (`Spinner`) sang danh sách các mã QR (`StackedQRList`). Do Spinner có kích thước nhỏ nằm giữa, còn danh sách QR chiếm diện tích lớn, việc render danh sách đột ngột khi tải xong API làm dịch chuyển vị trí của các layout khác.
    2.  **Modal QRFocusView đè giao diện:** Giao diện modal xuất hiện đè lên danh sách và thực hiện làm mờ (backdrop-blur) mà không có transition mượt mà hoặc làm dịch chuyển các phần tử phía dưới.
*   **Khuyến nghị:** 
    *   Xây dựng **Skeleton Screen** (khung xương mô phỏng thẻ QR) thay thế cho Spinner trong lúc loading để giữ chỗ trước cho danh sách QR.
    *   Đặt kích thước cố định (width/height) cho khung hình preview của QR Card.

### 3. LCP thực tế vọt lên 10.6 giây
*   **Nguyên nhân:**
    1.  **Đặc thù SPA:** Do phần tử lớn nhất vẽ trên màn hình (Tấm thiệp QR cỡ lớn trong `QRFocusView`) chỉ được render sau khi người dùng tương tác click chọn từ danh sách. Thời gian từ lúc load trang đến lúc click chọn là ~10.6s nên trình duyệt ghi nhận LCP = 10.6s.
    2.  **Tải bundle ban đầu chậm:** Ở chế độ mạng Slow 4G, việc tải toàn bộ code JS thô (chứa cả thư viện Konva, Lottie) mất tới ~10.6s trước khi lần vẽ đầu tiên (FCP) được thực hiện.
*   **Khuyến nghị:** Áp dụng Code Splitting (Lazy Load) cho trang Editor, Trang VCard Detail và Greeting Detail để giảm kích thước bundle trang đầu, giúp FCP/LCP tải trang ban đầu nhanh hơn.

### 4. Hiệu năng giảm dần khi số lượng danh sách QR tăng lên (MyQRsPage)
*   **Vấn đề:**
    Danh sách QR của người dùng càng nhiều mã thì tốc độ tải trang, độ trượt mượt mà (FPS) và chỉ số INP/TBT càng tệ.
*   **Nguyên nhân:**
    *   Trong danh sách QR (`StackedQRList`), mỗi card (`QRCardUI`) đều gọi component con là `<QRDisplay data={qrText} size={112} />`.
    *   Mỗi khi render, `QRDisplay` sẽ khởi tạo một thực thể mới của thư viện nặng `new QRCodeStyling(...)` và chạy hàm `append(container)` để vẽ SVG mã QR đồng bộ (synchronously) lên DOM.
    *   Khi có 10, 20 hay nhiều mã QR hơn, việc khởi tạo và vẽ đồng loạt này chiếm dụng CPU cực lớn ngay khi mount trang, gây nghẽn Main Thread trầm trọng.
*   **Khuyến nghị:**
    *   Áp dụng **Lazy Rendering** bằng `IntersectionObserver` cho component `<QRDisplay />`.
    *   Chỉ khi nào Card hiển thị (hoặc chuẩn bị cuộn tới cách viewport 100px), mã QR mới bắt đầu được vẽ. Ở trạng thái ngoài viewport, chỉ hiển thị một `div` placeholder nhẹ dạng pulse skeleton. Việc này phân bổ đều CPU load và triệt tiêu tình trạng block Main Thread khi mở danh sách dài.

---

## 🔍 Phân Tích Hiệu Năng Tải Ảnh (Image Loading Performance Analysis)

Dưới đây là kết quả đo lường và phân tích hiệu năng tải tài nguyên hình ảnh (Template, Sticker) trong ứng dụng khi chạy trên môi trường giả lập Zalo Simulator (mạng **Fast 4G**, **Enable Cache**):

### 1. Hiện trạng đo lường qua Network Tab
*   **Có cache:** Các ảnh đã tải trước đó được load lập tức từ bộ nhớ (`200 OK (from memory cache)` hoặc `(from disk cache)`), thời gian phản hồi chỉ **1 ms**.
*   **Không cache (chưa cache):** Các file ảnh tĩnh mới phải tải trực tiếp từ mạng và tốn từ **660 ms đến 834 ms** (gần 1 giây) để hiển thị.
*   **Định dạng không nhất quán:** Có tài nguyên dùng định dạng WebP (ví dụ file `767c6c27-...webp` nặng **177 kB**), có tài nguyên dùng PNG (ví dụ file `b452ffad-...png` nặng **24.1 kB**).

### 2. Nguyên nhân kỹ thuật gây ảnh load chậm (~1s)
1.  **Thiếu cơ chế Tải trì hoãn (Lazy Loading):**
    *   Các tab Template (`TemplateTab`) và Sticker (`StickerTab`) chứa hàng chục đến hàng trăm ảnh mẫu. Khi người dùng mở tab, toàn bộ thẻ `<img>` được render và kích hoạt tải đồng thời.
    *   Theo chuẩn HTTP/1.1, trình duyệt chỉ có tối đa 6 kết nối TCP đồng thời tới một host. Do đó, các ảnh phía sau bị rơi vào trạng thái **Connection Queueing** (xếp hàng chờ mạng). Thời gian phản hồi thực tế của một ảnh bao gồm cả thời gian xếp hàng này, khiến tổng thời gian tải bị kéo dài gần 1s.
2.  **Độ trễ do proxy trung gian (Cloudflare Tunnel):**
    *   Trong môi trường development/testing, đường dẫn ảnh được phân phối qua Cloudflare Tunnel (`trycloudflare.com`). Tunnel đi qua một máy chủ proxy trung gian nên có độ trễ khứ hồi (RTT) rất lớn. 
    *   Khi ứng dụng chạy trên production với máy chủ CDN trực tiếp (như Cloudflare CDN thực tế hoặc VNG CDN), độ trễ kết nối này sẽ giảm đi đáng kể (chỉ còn dưới 50ms).
3.  **Cấu hình Cache-Control chưa tối ưu:**
    *   Header phản hồi hiện tại là `Cache-Control: public, max-age=3600` (hiệu lực chỉ 1 giờ).
    *   Đây là cấu hình quá ngắn cho các tài nguyên tĩnh như Sticker hay Template (nội dung hầu như không đổi). Sau 1 giờ, trình duyệt buộc phải gửi lại request lấy ảnh từ mạng, làm mất đi lợi thế tải tức thì của cache.
4.  **Kích thước & định dạng ảnh chưa được tối ưu hóa:**
    *   Các file ảnh WebP dung lượng lớn (>100kB, thực tế đo được 177 kB) chính là các ảnh thành phẩm được xuất ra từ Konva Editor khi lưu thiết kế QR. Nguyên nhân do Konva đang cấu hình xuất ảnh WebP với chất lượng tối đa (`quality: 1.0` - tương đương nén lossless) và tỷ lệ điểm ảnh siêu cao (`pixelRatio: 3`). Điều này làm kích thước file phình to quá mức cần thiết cho nhu cầu hiển thị làm preview/thumbnail trên mobile.

### 3. Đề xuất Giải pháp Tối ưu hóa (Client-side & Server-side)
*   **Client-side (Áp dụng ngay vào Mini App):**
    *   **Tối ưu cấu hình xuất ảnh Konva:** Cấu hình lại các hàm `stage.toDataURL(...)` trong [qr.ts](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/utils/helpers/qr.ts) và [useEditor.ts](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/components/za-editor/hooks/useEditor.ts) sử dụng `pixelRatio: 2` (hoặc `1.5`) và `quality: 0.85` (thay vì `3` và `1.0`). Điều này giúp nén ảnh WebP hiệu quả, giảm dung lượng file lưu xuống dưới 35kB (giảm hơn 75%) mà mắt thường không thể phân biệt được sự giảm sút chất lượng trên màn hình điện thoại.
    *   **Chuyển đổi upload sang WebP:** Cập nhật hàm `resizeImage` trong [image.ts](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/utils/helpers/image.ts) xuất sang `"image/webp"` với `quality: 0.85` thay vì PNG không nén.
    *   **Lazy Loading:** Bổ sung `loading="lazy"` cho tất cả các thẻ `<img>` trong [TemplateTab.tsx](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/pages/edit-ui/components/TemplateTab.tsx) và [StickerTab.tsx](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/src/pages/edit-ui/components/StickerTab.tsx) để triệt tiêu Connection Queueing. Trình duyệt sẽ chỉ gửi request tải ảnh khi ảnh đó chuẩn bị cuộn vào viewport của người dùng.
    *   Khai báo kích thước (width/height) cố định cho thẻ ảnh để ngăn chặn Layout Shift (CLS) khi ảnh tải xong.
*   **Server-side (Đề xuất cấu hình hệ thống):**
    *   **Nâng thời gian cache:** Cấu hình lại server lưu trữ/CDN trả về header `Cache-Control: public, max-age=31536000, immutable` để lưu cache vĩnh viễn trên thiết bị người dùng.
    *   **Chuẩn hóa & nén ảnh:** Chuyển toàn bộ sticker/template sang WebP với chất lượng ~75-80% và giảm kích thước vật lý (resolution) về đúng kích thước hiển thị tối đa của UI (thumbnail sticker chỉ cần tối đa 120x120px, dung lượng dưới 30kB).

---

## 🔍 Phân Tích Performance Profile (Chrome DevTools Performance Trace)

Dưới đây là chi tiết phân tích chuyên sâu dựa trên các số liệu và ảnh chụp màn hình ghi nhận từ tab **Performance** của Chrome DevTools (giả lập **CPU: 4x slowdown** và mạng **Fast 4G**):

### 1. Phân Tích Bảng Bottom-Up (Các hàm ngốn CPU nhiều nhất)

*   **Hoạt động `M` trong thư viện `qr-code-styling.js`**
    *   **Self Time:** `1,107.2 ms` (Chiếm **12.6%** tổng thời gian ghi nhận).
    *   **Phân tích:** Đây chính là hàm thực thi lõi của thư viện QR Code Styling thực hiện vẽ và tính toán ma trận QR. Hàm này chạy đồng bộ (synchronously) hoàn toàn và giữ chặt Main Thread trong hơn 1.1s.
*   **Hàm nặc danh (anonymous) tại `qr-display.tsx:15:13`**
    *   **Self Time:** `946.7 ms` (Chiếm **10.8%** tổng thời gian ghi nhận).
    *   **Phân tích:** Đây chính là điểm bắt đầu của hook `useEffect` trong component `<QRDisplay />`. Nó chứng minh quá trình khởi tạo `new QRCodeStyling()` và gọi hàm vẽ `append(container)` cho từng thẻ QR trong danh sách là điểm nghẽn nghiêm trọng thứ hai.
*   **Tác vụ dựng hình `Recalculate style`**
    *   **Self Time:** `944.8 ms` (Chiếm **10.8%** tổng thời gian ghi nhận).
    *   **Phân tích:** Xảy ra do trình duyệt phải tính toán lại CSS và cấu trúc layout sau khi bị dồn dập chèn hàng loạt các phần tử SVG/DOM biểu diễn mã QR vào cây DOM.

👉 **Kết luận:** Ba tác vụ trên cộng lại chiếm tới **34.2%** tổng thời lượng xử lý của luồng chính Main Thread, trực tiếp gây ra độ trễ khởi tạo cực cao khi load danh sách.

### 2. Phân Tích Bảng Call Tree (Độ trễ tương tác & GC)

*   **Tác vụ dọn dẹp bộ nhớ `Major GC` (Garbage Collection)**
    *   **Thời gian:** `241.4 ms`.
    *   **Phân tích:** Việc tạo ra hàng chục thực thể `QRCodeStyling` rồi unmount/append liên tục sinh ra lượng lớn đối tượng rác trong bộ nhớ JS. Công cụ dọn rác V8 Engine buộc phải chạy quét rác quy mô lớn (Major GC), làm "đóng băng" Main Thread trong 241ms.
*   **Độ trễ cuộn trang `Event: wheel`**
    *   **Thời gian:** `2,688.8 ms` (Total Time).
    *   **Phân tích:** Khi người dùng cuộn (scroll) danh sách, việc browser liên tục tính toán style (`Recalculate style`), dựng hình (`Pre-paint`, `Commit`) và dọn bộ nhớ (`C++ GC`) khiến thao tác cuộn cực kỳ giật lag (giảm chỉ số FPS).

### 3. Phân Tích Long Task (Dữ liệu Timeline)

*   **Sự kiện nghẽn trên Timeline:** Một **Long Task** kéo dài đến **`196.76 ms`** được phát hiện khi zoom vào khu vực nhận dữ liệu.
*   **Luồng hoạt động gây nghẽn:** 
    1.  Màn hình nhận tín hiệu **`XHR load`** (danh sách QR được fetch thành công từ API).
    2.  Kích hoạt React re-render để cập nhật danh sách (`performWorkUntilDeadline`).
    3.  Lập tức chèn hàng loạt `<QRDisplay />` và kích hoạt hàm vẽ QR đồng bộ.
    4.  Trình duyệt rơi vào pha **`Recalculate style`** kéo dài, gây block Main Thread gần 200ms trước khi có thể vẽ frame tiếp theo.

---

## 🔍 Phân Tích React DevTools Profiler (React Render Cycles)

Dưới đây là chi tiết phân tích dữ liệu render và commit thu được từ React DevTools Profiler thông qua file xuất báo cáo [profiling-data.05-24-2026.23-36-13.json](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/docs/profiling-data.05-24-2026.23-36-13.json) cho luồng test: **Danh sách QR -> Tạo QR WiFi -> Danh sách QR** (Tổng thời gian test ~9.1s):

### 1. Hiện tượng Nghẽn ở Pha Passive Effect (`useEffect` của `QRDisplay`)

*   **Thời gian thực thi `passive-effect-mount`:**
    *   Mỗi khi component `<QRDisplay />` được mount, hook `useEffect` của nó tốn thời gian chạy thực (self duration) từ **`28.8 ms` đến `33.6 ms`** để vẽ SVG QR Code.
    *   *Chi tiết cụ thể:* Tại timestamp `7136ms`, `useEffect` của `QRDisplay` chạy mất **`32.3 ms`**.
*   **Hậu quả tích lũy:**
    *   Với danh sách gồm 8 mã QR được render đồng thời khi quay về trang chính, React phải xếp hàng chạy liên tục 8 lượt `useEffect` này, chiếm dụng hoàn toàn Main Thread trong khoảng: $8 \times \sim30ms \approx \mathbf{240ms}$.

### 2. Thời gian Commit DOM bị trì hoãn

*   **Commit Duration:** Tại commit số 14 (timestamp `7027ms` - khi người dùng chuyển từ trang Tạo QR quay lại trang danh sách), thời gian **Commit DOM kéo dài tới `267.5 ms`** (vượt rất xa mức mượt mà lý tưởng là `<16ms`).
*   **Phân tích:** Đây chính là thời điểm người dùng cảm nhận màn hình bị đứng hình (khựng lag) khoảng 0.3 giây trong lúc Zalo Mini App cố gắng tính toán và chèn hàng loạt thẻ SVG QR Code vào cây DOM.

### 3. Đề xuất Tối ưu hóa
*   Số liệu từ React Profiler củng cố kết luận: Để triệt tiêu độ trễ chuyển trang và cuộn trang, bắt buộc phải áp dụng **Lazy Rendering** (IntersectionObserver) cho component `<QRDisplay />` để trì hoãn việc chạy `useEffect` (vẽ SVG) của các thẻ QR đang nằm ngoài viewport hiển thị.

---

## 🔍 Phân Tích React DevTools Profiler - Case Full Flow (Trace: profiling-data.05-25-2026.00-07-36.json)

Dưới đây là kết quả phân tích chi tiết cho kịch bản chạy toàn vẹn (Full Flow) của ứng dụng với thời gian đo đạc kéo dài **~260 giây** (tổng cộng 543 commits, ghi nhận 1581 components):

**Flow thao tác:**
`Danh sách QR` ➔ `Tạo QR động và thiệp điện tử` ➔ `Tạo thiệp` ➔ `Lưu thiệp` ➔ `Lưu QR` ➔ `Danh sách QR` ➔ `Mở QR Focus View` ➔ `Mở QR Modal` ➔ `Vào edit thông tin` ➔ `Lưu thông tin` ➔ `về lại Danh sách QR` ➔ `QR Focus View` ➔ `Mở QR Modal` ➔ `Edit QR với QR Editor` ➔ `Lưu` ➔ `Danh sách QR`.

### 1. Bảng Chỉ số Điểm nghẽn (Spikes) Quan trọng
Profiler ghi nhận tổng cộng **48 commits bị nghẽn nặng** (Render Phase > 15ms hoặc Passive Effect Phase > 30ms) phân bổ ở các bước chuyển trang và lưu dữ liệu:

| Commit | Thời điểm (s) | Render Duration (ms) | Passive Effect (ms) | Thành phần chính gây nghẽn (Self/Actual Duration) |
| :---: | :---: | :---: | :---: | :--- |
| **#0** | 2.5s | **82.8 ms** | 4.0 ms | Khởi tạo ban đầu (`Radio.Group` tốn 11.8ms, `CreatePage` tốn 7.6ms) |
| **#355** | 139.5s | **41.5 ms** | **238.4 ms** | Chuyển trang về Danh sách QR Lần 1 (chạy effect của list components) |
| **#363** | 140.7s | **22.1 ms** | **267.8 ms** | Chuyển trang về Danh sách QR Lần 1 (chèn/vẽ SVG QR Code đồng bộ) |
| **#412** | 163.9s | **36.8 ms** | **265.4 ms** | Bấm lưu và unmount Editor để quay về danh sách (cleanup heavy components) |
| **#419** | 164.5s | **20.2 ms** | **248.3 ms** | Passive Effect chạy dọn dẹp và re-render khi về danh sách |
| **#447** | 169.7s | **51.8 ms** | 39.5 ms | Render trang tạo QR mới (`RenderedRoute` tốn 38.8ms để mount form) |
| **#483** | 215.7s | **51.1 ms** | 36.6 ms | Mở QR Editor (`RenderedRoute` tốn 42.1ms để khởi tạo Canvas/Konva Stage) |
| **#485** | 216.5s | **43.4 ms** | 35.0 ms | Rendering các frame canvas trong QR Editor |
| **#490** | 222.9s | **45.1 ms** | 34.9 ms | Render các thay đổi màu sắc/styles trên Editor |
| **#519** | 253.7s | **49.4 ms** | **286.7 ms** | Quay về Danh sách QR Lần 3 (Danh sách đã dài hơn, spike effect cực lớn) |
| **#520** | 254.3s | **241.3 ms** | 0.8 ms | Commit vẽ SVG đồng loạt cho danh sách QR dài (`RenderedRoute` block 234.3ms) |
| **#530** | 254.9s | **21.6 ms** | **266.1 ms** | Passive effect dọn dẹp trang Editor và cập nhật danh sách |
| **#539** | 257.5s | 16.7 ms | **32.4 ms** | Transition kết thúc, dọn dẹp DOM |

---

### 2. Phân tích Chi tiết Nguyên nhân theo Từng Giai đoạn

#### 🔴 A. Giai đoạn Quay về Danh sách QR (Spikes ở 139s - 144s và 253s - 257s)
*   **Hiện tượng:** Mỗi khi người dùng bấm nút back hoặc lưu để quay trở lại `MyQRsPage`, ứng dụng bị giật khựng rất rõ (đứng hình khoảng 0.3s - 0.5s).
*   **Lý do kỹ thuật từ Profiler:**
    *   **Render Block (Commit #520 - 241.3ms):** Khi danh sách QR tăng lên sau khi tạo mới và edit, component `RenderedRoute` (layout wrapper/router outlet) tốn đến **234.3ms** self duration để render. Đây là lúc cây DOM bị chèn hàng loạt các SVG QR Code mới.
    *   **Passive Effect Spikes (Commit #355 - 238.4ms, #363 - 267.8ms, #519 - 286.7ms, #530 - 266.1ms):** Khi mount `MyQRsPage`, React DevTools ghi nhận CPU bị nghẽn cứng ở pha Passive Effect. Đây là thời gian thực thi của các hook `useEffect` trong `<QRDisplay />` để gọi khởi tạo thư viện `qr-code-styling` và `append` đồng bộ SVG vào DOM. Do danh sách dài, 8-10 components con chạy đồng thời làm tổng thời gian block luồng chính lên đến gần **300ms**!

#### 🔴 B. Giai đoạn Mở và Thao tác trên QR Editor (Spikes ở 215s - 226s)
*   **Hiện tượng:** Khi click chọn "Edit QR với QR Editor", giao diện chuyển trang bị trễ nhẹ. Trong lúc thao tác kéo thả/đổi màu trên canvas, CPU bị load cao.
*   **Lý do kỹ thuật từ Profiler:**
    *   **Khởi tạo Editor (Commit #483 - Render 51.1ms, Effect 36.6ms):** Để dựng lên trình chỉnh sửa QR nâng cao, ứng dụng phải khởi tạo thư viện `react-konva` và dựng thẻ HTML5 Canvas (Konva Stage). Việc này tốn **42.1ms** render đồng bộ và **36.6ms** effect để bind event.
    *   **Update Canvas Frames (Commit #485 đến #493):** Mỗi hành động thay đổi style mã QR (đổi màu dot, góc bo, mắt QR) hoặc chỉnh sửa layout thiệp đều bắt Konva render lại các node hình học trên Canvas, block Main Thread từ **42ms - 45ms** mỗi commit.

#### 🔴 C. Giai đoạn Edit thông tin text và Lưu (Spikes ở 163s - 169s)
*   **Hiện tượng:** Bấm lưu thông tin text (ví dụ đổi tên gợi nhớ, đổi số tài khoản ngân hàng) rồi quay lại trang chính gây khựng nhẹ.
*   **Lý do kỹ thuật từ Profiler:**
    *   Trùng khớp với phân tích INP ban đầu: Quá trình unmount form (`QREditor` hoặc Form nhập liệu) giải phóng lượng lớn DOM và React state. Đồng thời trang danh sách được mount và gọi API cập nhật state, chạy transition làm block luồng chính. `CSSTransition2` chiếm từ **10ms - 15ms** trong nhiều commit liên tục (Commit #438, #439, #440) gây ra hiện tượng giật khung hình (dropped frames).

---

### 3. Kết luận và Kế hoạch Tối ưu hóa (Approved Action Plan)
Báo cáo profiler kịch bản full flow này củng cố các giả thuyết và kế hoạch tối ưu đã đề ra, đồng thời đưa ra thêm một số định hướng chi tiết:

1.  **Trì hoãn API và Transition:** Bắt buộc áp dụng `setTimeout 200ms` trì hoãn gọi `fetchQRRecords()` và `fetchBanks()` khi về lại trang danh sách.
2.  **Lazy Render QR Codes (Mấu chốt xử lý Render Spike 241ms):** Sử dụng `IntersectionObserver` để chỉ thực thi `useEffect` của `<QRDisplay />` (khởi tạo `QRCodeStyling` và `append` SVG) khi card QR đó cuộn vào vùng nhìn thấy (viewport). Các card ngoài viewport sẽ hiển thị một skeleton box tĩnh. Việc này sẽ giảm render duration từ **241ms xuống < 15ms**!
3.  **Lazy Load QR Editor và Canvas (Mấu chốt xử lý bundle size và Editor Mount):** Trích xuất phần Editor nâng cao (chứa `react-konva` và Canvas logic) thành một lazy component (`React.lazy`). Chỉ tải bundle và khởi tạo Editor khi người dùng click vào nút "Edit QR". Việc này giúp giảm bundle size ban đầu và tăng tốc độ tải ứng dụng đáng kể.
