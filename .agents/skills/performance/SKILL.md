---
name: frontend-performance
description: >
  Mentor và tư vấn về Frontend Performance — bao gồm đo lường, phân tích, tối ưu hóa, và chuẩn bị trình bày kết quả before/after. Kích hoạt skill này khi người dùng hỏi về: Core Web Vitals (LCP, INP, CLS), tốc độ load trang, tốc độ render, tốc độ phản hồi UI, bundle size, Lighthouse, React performance, debounce, lazy loading, code splitting, Web Worker, hoặc bất kỳ câu hỏi nào liên quan đến "app chạy chậm", "tối ưu performance", "đo performance", "before after optimization", "chuẩn bị present về performance", hay "senior hỏi về performance". Cũng dùng khi người dùng cần chuẩn bị cho technical interview, probation review, hoặc technical presentation liên quan đến frontend.
---

# Frontend Performance Skill

Skill này giúp mentor về Frontend Performance: từ đo lường baseline, chọn kỹ thuật optimize, đến trình bày kết quả before/after một cách chuyên nghiệp.

---

## Quy trình làm việc (Workflow)

Khi được kích hoạt, hãy xác định người dùng đang ở giai đoạn nào:

1. **Chưa biết gì** → Giải thích metrics + hướng dẫn đo Lighthouse
2. **Đã đo, chưa optimize** → Đọc số liệu, đề xuất kỹ thuật phù hợp
3. **Đã optimize** → Giúp trình bày before/after, chuẩn bị script nói
4. **Chuẩn bị present/interview** → Tạo script trả lời, dự đoán câu hỏi bẫy

Luôn hỏi thêm nếu chưa biết: stack (React/Vue/Vanilla), loại app, thời gian còn lại.

---

## Phần 1: Core Web Vitals — Metrics Chuẩn

Nguồn gốc: **Google** định nghĩa và publish tại web.dev/vitals. Đây là industry standard.

### Ba metrics chính (tính đến 2024+)

| Metric | Đo gì | Ngưỡng Good | Ngưỡng Poor |
|--------|-------|-------------|-------------|
| **LCP** — Largest Contentful Paint | Thời gian render phần tử lớn nhất | < 2.5s | > 4s |
| **INP** — Interaction to Next Paint | Độ trễ từ khi user tương tác đến UI phản hồi | < 200ms | > 500ms |
| **CLS** — Cumulative Layout Shift | Layout có bị nhảy lung tung không | < 0.1 | > 0.25 |

> ⚠️ INP đã **replace FID** từ tháng 3/2024. FID chỉ đo lần tương tác đầu tiên; INP đo tất cả interactions trong suốt session → khắt khe hơn nhiều.

### Metrics bổ sung (nên biết)

```
TTFB  - Time To First Byte      → Server phản hồi nhanh không
FCP   - First Contentful Paint  → Lần đầu user thấy GÌ ĐÓ trên màn hình
TTI   - Time To Interactive     → Bao lâu thì app "dùng được" thực sự
TBT   - Total Blocking Time     → JS block main thread bao lâu (proxy cho INP trong Lighthouse)
```

---

## Phần 2: Công cụ đo lường

### Lighthouse (Bắt buộc làm trước)
- Chrome DevTools (F12) → Tab **Lighthouse** → chọn **Performance** → **Analyze page load**
- Cho điểm 0–100, breakdown từng metric
- **Lưu ý quan trọng:** Lighthouse là **lab data** (môi trường kiểm soát), không phải field data thực tế. Google dùng **Chrome UX Report (CrUX)** ở p75 để đánh giá chính thức.
- Nên throttle CPU 4x + Slow 3G để mô phỏng điều kiện thực tế

### Web Vitals JS Library (đo số thật trong app)
```bash
npm install web-vitals
```
```javascript
import { getLCP, getCLS, getINP, getFCP, getTTFB } from 'web-vitals';

getLCP(m => console.log('LCP:', m.value));
getINP(m => console.log('INP:', m.value));
getCLS(m => console.log('CLS:', m.value));
getFCP(m => console.log('FCP:', m.value));
getTTFB(m => console.log('TTFB:', m.value));
```

### Chrome DevTools — Performance Tab
- Record → interact → Stop → phân tích flame chart
- Tìm **Long Tasks** (> 50ms) — đây là thủ phạm làm INP tệ

### React DevTools Profiler (React apps)
- Xem component nào render bao nhiêu lần, mất bao lâu
- Tìm component re-render không cần thiết

---

## Phần 3: Kỹ thuật Optimize

### 3.1 Debounce Input *(Dễ nhất — làm đầu tiên)*
**Vấn đề:** Generate QR / call API mỗi keystroke → CPU spike → INP tệ

```javascript
// ❌ Before
onChange={(e) => generateQR(e.target.value)}

// ✅ After — đợi user gõ xong 300ms
import { useDebouncedCallback } from 'use-debounce'
const debouncedGenerate = useDebouncedCallback(generateQR, 300)
onChange={(e) => debouncedGenerate(e.target.value)}
```
**Kết quả:** INP cải thiện rõ rệt, CPU usage giảm

---

### 3.2 React.memo — Tránh re-render không cần thiết
**Vấn đề:** Component re-render mỗi khi parent render dù props không đổi

```javascript
// ❌ Before
const QRDisplay = ({ value }) => <QRCode value={value} />

// ✅ After
const QRDisplay = React.memo(({ value }) => <QRCode value={value} />)

// Kết hợp useMemo cho computed values
const qrConfig = useMemo(() => buildConfig(options), [options])
```
**Kết quả:** Ít render cycle → INP và TBT cải thiện

---

### 3.3 Code Splitting / Lazy Loading
**Vấn đề:** Load hết JS một lúc → bundle to → FCP chậm

```javascript
// ❌ Before
import QRGenerator from './QRGenerator'
import History from './History'
import Settings from './Settings'

// ✅ After
const QRGenerator = lazy(() => import('./QRGenerator'))
const History = lazy(() => import('./History'))
const Settings = lazy(() => import('./Settings'))

// Wrap bằng Suspense
<Suspense fallback={<Spinner />}>
  <QRGenerator />
</Suspense>
```
**Kết quả:** Bundle size giảm → FCP và LCP nhanh hơn

---

### 3.4 Web Worker cho heavy computation
**Vấn đề:** Generate QR trên main thread → block UI → LCP và INP tệ

```javascript
// ❌ Before — block main thread
const generateQR = (value) => {
  const qr = QRCode.generate(value) // synchronous, blocks UI
  setQRData(qr)
}

// ✅ After — đẩy sang Worker thread
// qr.worker.js
self.onmessage = ({ data }) => {
  const result = QRCode.generate(data.value)
  self.postMessage(result)
}

// App.jsx
const worker = new Worker(new URL('./qr.worker.js', import.meta.url))
worker.postMessage({ value })
worker.onmessage = (e) => setQRData(e.data)
```
**Kết quả:** Main thread không bị block → LCP và INP đều cải thiện

---

### 3.5 Image Optimization — Fix CLS
**Vấn đề:** Ảnh không có dimension → layout shift khi load xong

```html
<!-- ❌ Before: CLS cao vì browser không biết kích thước trước -->
<img src="logo.png" />

<!-- ✅ After: Khai báo dimension, dùng WebP nhẹ hơn ~30% -->
<img src="logo.webp" width="200" height="200" loading="lazy" />
```
**Kết quả:** CLS về gần 0

---

### 3.6 Preload tài nguyên critical
```html
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin />
<link rel="preload" href="/images/hero.webp" as="image" />
```
**Kết quả:** FCP nhanh hơn vì browser fetch sớm hơn

---

## Phần 4: Script trả lời cho Present / Interview

### Template chuẩn (Before → After → Vì sao)
> *"Em dùng Lighthouse để đo baseline. Ban đầu [METRIC] là [SỐ TRƯỚC]. Sau khi [KỸ THUẬT ĐÃ DÙNG], [METRIC] xuống còn [SỐ SAU], đạt ngưỡng Good của Google."*

### Câu hỏi thường gặp — Script mẫu

**"Em có đo performance không?"**
> *"Dạ có. Em dùng Lighthouse đo baseline, LCP ban đầu khoảng 3.2s vì QR canvas render synchronous trên main thread. Em apply debounce 300ms và React.memo, LCP xuống còn ~1.4s. INP cải thiện từ ~450ms xuống ~180ms, đạt ngưỡng Good."*

**"Em biết Core Web Vitals không?"**
> *"Dạ, gồm 3 metrics: LCP đo thời gian render phần tử lớn nhất — ngưỡng tốt dưới 2.5s. INP đo độ trễ khi user tương tác — dưới 200ms, đây là metric thay FID từ 2024 vì INP đo tất cả interactions chứ không chỉ lần đầu. CLS đo độ ổn định layout — dưới 0.1."*

**"Sao không dùng [X approach]?"**
> *"Dạ em có tìm hiểu về [X]. Trong context mini app này, em ưu tiên [approach đã dùng] vì [lý do]. Nếu scale lên hoặc nhiều user hơn em sẽ xem xét thêm [X]."*
*(Công thức: Acknowledge → Justify → Show growth mindset)*

---

## Phần 5: Số liệu tham khảo cho QR Mini App

Dùng khi chưa kịp đo thật — nhưng **nên đo thật** vì senior sẽ hỏi sâu:

| Metric | Trước optimize | Sau optimize |
|--------|---------------|-------------|
| LCP | 2.8 – 3.5s | 1.2 – 1.8s |
| INP | 300 – 500ms | 100 – 180ms |
| CLS | 0.08 – 0.15 | 0 – 0.05 |
| Lighthouse Score | 55 – 70 | 80 – 90 |

---

## Phần 6: Câu hỏi bẫy thường gặp

**"Lighthouse 90+ rồi thì đủ tốt chưa?"**
> Lighthouse là lab data. Google đánh giá chính thức bằng field data từ CrUX ở p75 — tức 75% user thật phải đạt Good. Với mini app nội bộ thì Lighthouse là đủ để baseline, nhưng production app cần Real User Monitoring (RUM).

**"INP khác FID thế nào?"**
> FID chỉ đo lần tương tác đầu tiên. INP đo tất cả interactions trong suốt session và lấy worst case → phản ánh thực tế hơn. Google replace FID bằng INP từ tháng 3/2024.

**"Em đo trên máy mình hay device thật?"**
> Lighthouse trên máy dev cho điểm cao hơn thực tế vì CPU/network mạnh hơn. Nên throttle CPU 4x + Slow 3G để mô phỏng điều kiện thực. Tốt nhất là đo thêm trên mobile thật.

**"TBT và INP liên quan gì nhau?"**
> TBT là proxy của INP trong Lighthouse — vì Lighthouse không simulate real interactions. TBT đo tổng thời gian JS blocking main thread; INP cao thường đi kèm TBT cao. Lighthouse dùng TBT, còn INP thật cần đo bằng web-vitals lib hoặc CrUX.

---

## Checklist Before / After Present

- [ ] Chạy Lighthouse → chụp màn hình baseline (Before)
- [ ] Ghi lại: LCP, TBT, CLS, Lighthouse Score
- [ ] Cài `web-vitals` lib, log INP thật ra console
- [ ] Apply ít nhất 1 optimization (debounce là dễ nhất, 30 phút)
- [ ] Chạy Lighthouse lại → chụp màn hình (After)
- [ ] Chuẩn bị nói: "Before X → After Y → vì Z"
- [ ] Luyện trả lời 3 câu hỏi mẫu ở Phần 4
