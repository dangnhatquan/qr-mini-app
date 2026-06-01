# Hướng dẫn & Checklist Đo lường Hiệu năng Sau Tối ưu hóa (After Optimization)

Tài liệu này cung cấp danh sách các bước (TODO list) step-by-step để tiến hành đo lường lại các chỉ số hiệu năng của Zalo Mini App sau khi đã thực hiện tối ưu hóa, đảm bảo tính đối chiếu chính xác và khách quan với dữ liệu **Baseline (Before)** trong [lighthouse_analysis_baseline.md](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/docs/lighthouse_analysis_baseline.md).

---

## 🛠️ Bước 1: Chuẩn bị Môi trường Kiểm thử Sạch

Để loại bỏ các yếu tố gây nhiễu chỉ số (như CPU jitter, Chrome extensions chặn luồng, cache cũ):

- [ ] **Khởi động Local Server:** Chạy lệnh start dự án ở terminal:
  ```bash
  npm run start
  # Hoặc sử dụng Makefile
  make dev
  ```
- [ ] **Sử dụng Google Chrome ẩn danh (Incognito Mode):** Mở cửa sổ ẩn danh mới để chạy test, tránh việc Chrome Extensions chạy ngầm làm tăng Total Blocking Time (TBT).
- [ ] **Xác định URL và Cổng chạy:** Truy cập đúng cổng dev server đang hiển thị (thường là `http://localhost:3000` hoặc `http://localhost:2999`).

---

## 📊 Bước 2: Đo lường Chỉ số Lighthouse (Môi trường Dev)

Thực hiện đúng cấu hình đo lường như lượt chạy Baseline:

### 1. Lượt 1: Có Cache (Cached Run)
- [ ] Truy cập `http://localhost:3000` trên cửa sổ ẩn danh.
- [ ] Mở **Chrome DevTools** (F12 hoặc `Cmd + Option + I`).
- [ ] Chọn tab **Lighthouse**.
- [ ] Cấu hình Lighthouse:
  - **Device:** `Mobile`
  - **Categories:** Chỉ chọn `Performance`
  - **Clear storage / Disable Cache:** **KHÔNG** tích chọn (để kiểm tra hiệu năng khi tài nguyên đã được cache).
- [ ] Click **Analyze page load**.
- [ ] Lưu báo cáo: Click icon 3 chấm ở góc phải Lighthouse -> **Save as JSON** -> đặt tên là `docs/localhost_3000-after-cached.json`.

### 2. Lượt 2: Không Cache + Giả lập mạng (No Cache + Fast 4G Throttling)
- [ ] Quay lại tab Lighthouse.
- [ ] Cấu hình Lighthouse:
  - **Device:** `Mobile`
  - **Categories:** `Performance`
  - **Clear storage / Disable Cache:** **TÍCH CHỌN** (để giả lập lần đầu tiên truy cập ứng dụng).
- [ ] Ở phần Throttling của Lighthouse (hoặc trong tab Network của DevTools): Chọn cấu hình **Simulated (Fast 4G)** hoặc preset tương đương.
- [ ] Click **Analyze page load**.
- [ ] Lưu báo cáo: Click icon 3 chấm -> **Save as JSON** -> đặt tên là `docs/localhost_3000-after-no-cache.json`.
- [ ] Ghi lại các chỉ số hiển thị để điền vào Dashboard:
  - [ ] **Performance Score** (Mục tiêu: **> 80**)
  - [ ] **LCP (Largest Contentful Paint)** (Mục tiêu: **< 2.5 s**)
  - [ ] **FCP (First Contentful Paint)** (Mục tiêu: **< 1.8 s**)
  - [ ] **TBT (Total Blocking Time)** (Mục tiêu: **< 200 ms**)
  - [ ] **CLS (Cumulative Layout Shift)** (Mục tiêu: **< 0.05**)
  - [ ] **Speed Index (SI)** (Mục tiêu: **< 4.0 s**)

---

## 📱 Bước 3: Đo lường Trải nghiệm Thực tế (Field Data/RUM) trên Zalo Simulator

Mở **Zalo DevTools** (Simulator) và cấu hình Network sang profile **Slow 4G**:

- [ ] **Cấu hình mạng:** Đảm bảo network throttling là **Slow 4G** (hoặc cấu hình Custom Profile: Latency ~150ms, Download ~1.5 Mbps, Upload ~750 Kbps).
- [ ] **Chỉ số INP khi thoát/lưu từ Editor về trang chính:**
  1. Mở tab **Performance** trong DevTools.
  2. Bấm **Record** (nút tròn).
  3. Thực hiện hành động: Đang ở trang **QR Editor** -> nhấn nút **Lưu** (dấu Check xanh) để quay về trang danh sách `my-qrs`.
  4. Bấm **Stop Record** và ghi nhận thời gian **Interaction to Next Paint (INP)** (Mục tiêu: **< 100 ms**, Baseline trước đó là **232 ms**).
- [ ] **Chỉ số CLS (Modal & Spinner/Skeleton):**
  1. Theo dõi hiện tượng giật cục giao diện khi danh sách mã QR chuyển đổi từ trạng thái tải (Loading/Skeleton) sang hiển thị thật.
  2. Ghi nhận chỉ số **CLS** thực tế trên màn hình (Mục tiêu: **< 0.1**, Baseline trước đó là **0.316** nhờ áp dụng Skeleton Screen).
- [ ] **Chỉ số LCP thực tế (Modal Focus QR):**
  1. Đo thời gian từ lúc click vào QR card trong danh sách đến khi tấm ảnh QR cỡ lớn trong modal `QRFocusView` hiển thị đầy đủ và sắc nét (Mục tiêu: **< 2.0 s**, Baseline trước đó là **10.6 s** nhờ tối ưu hóa lazy load ảnh template/sticker và nén ảnh WebP).
- [ ] **Chỉ số INP khi nhập liệu Form:**
  1. Record Performance trong khi gõ nhanh dữ liệu vào các ô input (như tên WiFi, password, bank info).
  2. Đo độ trễ phản hồi (Mục tiêu: **< 50 ms**, Baseline trước đó là **56 - 112 ms**).

---

## 🧪 Bước 4: Ghi nhận & Phân tích React DevTools Profiler (Full Flow)

Thực hiện quy trình recording đầy đủ để phân tích chi tiết các Render Spikes bằng script:

- [ ] Mở **Chrome DevTools** -> Chọn tab **Profiler** (của React Developer Tools).
- [ ] Bấm **Record** (nút tròn đỏ).
- [ ] Thực hiện đúng kịch bản Full Flow kiểm thử sau:
  1. Bắt đầu ở trang **Danh sách QR** (`my-qrs`).
  2. Click tạo mới một QR Code (ví dụ WiFi QR) và chuyển đến trang nhập form.
  3. Chọn một Template thiệp điện tử -> Nhấn **Lưu thiệp** -> Nhấn **Lưu QR**.
  4. Hệ thống chuyển hướng đưa bạn quay lại **Danh sách QR** (Lần 1).
  5. Click vào QR Card vừa tạo để mở `QRFocusView` -> Click tiếp để mở Modal phóng to chi tiết.
  6. Đóng các Modal, click chọn sửa thông tin text của QR đó -> Thay đổi nội dung -> Click **Lưu** -> Quay lại **Danh sách QR** (Lần 2).
  7. Click mở `QRFocusView` -> Click chọn nút **"Edit QR với QR Editor"** để mở Konva Editor.
  8. Thực hiện thay đổi màu sắc/styles của mã QR trên Canvas -> Click **Lưu** -> Quay lại **Danh sách QR** (Lần 3 - lúc này danh sách đã dài hơn).
- [ ] Bấm **Stop Recording** trong React Profiler.
- [ ] Click nút **Export Profile** (icon Tải xuống) trên Profiler panel.
- [ ] Lưu file vào thư mục của dự án: `docs/profiling-data.after.json`.
- [ ] Chạy script phân tích tự động:
  ```bash
  # Cú pháp: node docs/analyze_profiler_data.js <đường_dẫn_file_json_vừa_tải> <đường_dẫn_báo_cáo_markdown_muốn_xuất>
  node docs/analyze_profiler_data.js docs/profiling-data.after.json docs/profiler_analysis_report_after.md
  ```
- [ ] Kiểm tra báo cáo mới được sinh ra tại [profiler_analysis_report_after.md](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/docs/profiler_analysis_report_after.md) để đối chiếu số lượng commits bị nghẽn (render > 15ms hoặc effect > 30ms) đặc biệt tại các pha quay lại trang danh sách.

---

## 📝 Bước 5: Cập nhật Bảng So Sánh Đối Chiếu (Dashboard)

- [ ] Mở file [lighthouse_analysis_baseline.md](file:///Users/lap14950/Documents/Work/VNG%20Projects/QR%20Mini%20App/Source%20Code/qr-mini-app/docs/lighthouse_analysis_baseline.md).
- [ ] Cập nhật toàn bộ các chỉ số thu được vào cột **Sau tối ưu (After)** của hai bảng:
  - **1. Bảng Chỉ số Hiệu năng & Trải nghiệm Người dùng (UX & Performance Metrics)**
  - **2. Các điểm nghẽn kỹ thuật chính & Chỉ số React Profiler**
- [ ] So sánh mức độ giảm thiểu render time của cấu trúc mã mới (ví dụ: render thời gian thực của `<QRDisplay>` giảm từ ~240ms xuống bao nhiêu nhờ Lazy Rendering).
