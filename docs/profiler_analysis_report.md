# Báo cáo Phân tích React Profiler Trace (Case Full Flow)

## 📌 Thông tin chung
- **Thời gian profiling:** ~260 giây (tổng cộng 543 commits).
- **Tổng số components ghi nhận:** 1581.
- **Flow kiểm thử:**
  1. **Danh sách QR** ->
  2. **Tạo QR động và thiệp điện tử** ->
  3. **Tạo thiệp** -> **Lưu thiệp** -> **Lưu QR** ->
  4. **Danh sách QR** ->
  5. **Mở QR Focus View** -> **Mở QR Modal** ->
  6. **Edit thông tin** -> **Lưu thông tin** ->
  7. **Về lại Danh sách QR** ->
  8. **QR Focus View** -> **Mở QR Modal** ->
  9. **Edit QR với QR Editor** -> **Lưu** ->
  10. **Danh sách QR**.

---

## 🚨 Các điểm nghẽn hiệu năng nghiêm trọng nhất (Spikes)

Dưới đây là danh sách các commits có thời gian xử lý render (Render Phase) > 15ms hoặc thời gian chạy hook effect (Passive Effect Phase) > 30ms:

| Commit | Timestamp (s) | Render Duration (ms) | Passive Effect (ms) | Độ ưu tiên | Thành phần tốn CPU nhiều nhất (Self Duration) |
| :---: | :---: | :---: | :---: | :---: | :--- |
| #0 | 2.5s | 82.8ms | 4.0ms | Immediate | Radio.Group (11.8ms) |
| #12 | 5.5s | 15.5ms | 3.6ms | Normal | Unknown_188 (1.4ms) |
| #15 | 6.3s | 19.1ms | 2.4ms | Immediate | CSSTransition2 (11.4ms) |
| #69 | 18.2s | 37.3ms | 3.0ms | Immediate | ClearableLabeledBaseInput2 (3.1ms) |
| #339 | 128.2s | 54.8ms | 3.4ms | Immediate | Routes (3.7ms) |
| #355 | 139.5s | 41.5ms | 238.4ms | Normal | static (3.7ms) |
| #363 | 140.7s | 22.1ms | 267.8ms | Immediate | Routes (0.9ms) |
| #368 | 142.0s | 17.1ms | 0.1ms | Normal | Routes (0.9ms) |
| #369 | 143.5s | 16.0ms | 0.0ms | Immediate | CSSTransition2 (1.0ms) |
| #370 | 143.6s | 15.9ms | 0.0ms | Immediate | Routes (0.7ms) |
| #371 | 143.6s | 16.6ms | 38.5ms | Immediate | CSSTransition2 (0.8ms) |
| #372 | 143.7s | 17.1ms | 0.0ms | Normal | .$/create (0.8ms) |
| #373 | 146.2s | 18.5ms | 0.2ms | Immediate | CSSTransition2 (0.8ms) |
| #378 | 146.5s | 16.6ms | 0.0ms | Normal | .$/create (3.1ms) |
| #382 | 154.4s | 23.8ms | 1.6ms | Immediate | Routes (1.7ms) |
| #412 | 163.9s | 36.8ms | 265.4ms | Normal | static (3.1ms) |
| #419 | 164.5s | 20.2ms | 248.3ms | Immediate | Routes (0.8ms) |
| #420 | 165.1s | 18.2ms | 0.3ms | Immediate | CreatePage (0.9ms) |
| #423 | 165.7s | 18.2ms | 0.0ms | Normal | Routes (1.0ms) |
| #428 | 166.6s | 15.9ms | 0.0ms | Immediate | Routes (0.9ms) |
| #429 | 166.7s | 15.9ms | 0.0ms | Immediate | ForwardRef(Anonymous) (0.9ms) |
| #430 | 166.7s | 16.9ms | 39.1ms | Immediate | CSSTransition2 (0.9ms) |
| #431 | 166.8s | 15.4ms | 0.0ms | Normal | Routes (0.8ms) |
| #432 | 167.8s | 18.0ms | 0.0ms | Immediate | CSSTransition2 (0.9ms) |
| #437 | 168.1s | 23.3ms | 0.0ms | Normal | PickerTrigger2 (1.8ms) |
| #438 | 168.2s | 15.4ms | 0.0ms | Normal | CSSTransition2 (1.3ms) |
| #439 | 168.2s | 15.4ms | 0.0ms | Normal | CSSTransition2 (1.3ms) |
| #440 | 168.6s | 15.4ms | 0.0ms | Normal | CSSTransition2 (1.3ms) |
| #441 | 169.4s | 40.5ms | 1.9ms | Immediate | ForwardRef(Anonymous) (2.9ms) |
| #447 | 169.7s | 51.8ms | 39.5ms | Immediate | RenderedRoute (38.8ms) |
| #483 | 215.7s | 51.1ms | 36.6ms | Immediate | RenderedRoute (42.1ms) |
| #485 | 216.5s | 43.4ms | 35.0ms | Immediate | RenderedRoute (36.9ms) |
| #488 | 219.5s | 43.2ms | 32.9ms | Immediate | RenderedRoute (34.8ms) |
| #490 | 222.9s | 45.1ms | 34.9ms | Immediate | RenderedRoute (37.3ms) |
| #493 | 226.2s | 42.4ms | 32.1ms | Immediate | RenderedRoute (34.4ms) |
| #500 | 242.6s | 36.4ms | 19.8ms | Normal | RenderedRoute (22.4ms) |
| #518 | 253.6s | 32.4ms | 17.9ms | Immediate | RenderedRoute (20.2ms) |
| #519 | 253.7s | 49.4ms | 286.7ms | Immediate | static (1.9ms) |
| #520 | 254.3s | 241.3ms | 0.8ms | Immediate | RenderedRoute (234.3ms) |
| #530 | 254.9s | 21.6ms | 266.1ms | Immediate | Routes (0.8ms) |
| #531 | 255.5s | 17.6ms | 0.7ms | Immediate | Routes (1.0ms) |
| #532 | 256.2s | 15.7ms | 0.8ms | Normal | UploadFormField (0.9ms) |
| #537 | 257.4s | 15.6ms | 0.0ms | Immediate | Routes (0.9ms) |
| #538 | 257.5s | 16.3ms | 0.0ms | Immediate | Routes (0.9ms) |
| #539 | 257.5s | 16.7ms | 32.4ms | Immediate | CreatePage (0.9ms) |
| #540 | 257.6s | 15.7ms | 0.0ms | Normal | CSSTransition2 (0.9ms) |
| #541 | 272.5s | 18.1ms | 0.0ms | Immediate | ForwardRef(Anonymous) (0.8ms) |
| #542 | 272.8s | 17.3ms | 0.0ms | Normal | .$/create (1.9ms) |

---

## 🔍 Chi tiết Phân tích các Giai đoạn chính (Flow Breakdown)

### 🎬 Giai đoạn: Khởi động & Danh sách QR ban đầu (0s - 15s)
- **Số lượng Commits:** 61
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 3
- **Chi tiết các commits nghẽn:**
  * **Commit #0** tại **2.5s**: Render = **82.8ms**, Passive Effect = **4.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Radio.Group`: 11.8ms
      * `CreatePage`: 7.6ms
      * `Routes`: 1.8ms
      * `Controller`: 1.5ms
      * `Unknown_188`: 1.5ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `BrowserRouter`: 82.8ms
      * `Router`: 82.5ms
      * `AuthProvider`: 82.2ms
  * **Commit #12** tại **5.5s**: Render = **15.5ms**, Passive Effect = **3.6ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `Unknown_188`: 1.4ms
      * `Context.Provider`: 0.8ms
      * `RenderedRoute`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.8ms
      * `Transition2`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 15.5ms
      * `ForwardRef(Anonymous)`: 15.3ms
      * `ForwardRef(Anonymous)`: 14.3ms
  * **Commit #15** tại **6.3s**: Render = **19.1ms**, Passive Effect = **2.4ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 11.4ms
      * `CreatePage`: 1.6ms
      * `ForwardRef(Anonymous)`: 1.1ms
      * `Unknown_191`: 1.0ms
      * `CSSTransition2`: 0.9ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Unknown_188`: 19.1ms
      * `Unknown_191`: 19.0ms
      * `Unknown_190`: 19.0ms

### 🎬 Giai đoạn: Tạo QR động & Chọn thiệp điện tử (15s - 100s)
- **Số lượng Commits:** 246
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 1
- **Chi tiết các commits nghẽn:**
  * **Commit #69** tại **18.2s**: Render = **37.3ms**, Passive Effect = **3.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `ClearableLabeledBaseInput2`: 3.1ms
      * `.$/create`: 1.8ms
      * `portal`: 1.6ms
      * `CreatePage`: 1.4ms
      * `BaseInput2`: 1.4ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Router`: 37.3ms
      * `BrowserRouter`: 37.3ms
      * `AuthProvider`: 37.2ms

### 🎬 Giai đoạn: Tạo thiệp, Lưu thiệp & Lưu QR (100s - 135s)
- **Số lượng Commits:** 41
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 1
- **Chi tiết các commits nghẽn:**
  * **Commit #339** tại **128.2s**: Render = **54.8ms**, Passive Effect = **3.4ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 3.7ms
      * `CreatePage`: 3.4ms
      * `InputFormField`: 1.9ms
      * `WifiForm`: 1.6ms
      * `AnimationRoutes2`: 1.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `BrowserRouter`: 54.8ms
      * `Router`: 54.3ms
      * `AuthProvider`: 53.4ms

### 🎬 Giai đoạn: Quay về Danh sách QR (Lần 1) (135s - 145s)
- **Số lượng Commits:** 25
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 7
- **Chi tiết các commits nghẽn:**
  * **Commit #355** tại **139.5s**: Render = **41.5ms**, Passive Effect = **238.4ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `static`: 3.7ms
      * `Routes`: 1.8ms
      * `ChevronLeft`: 1.8ms
      * `PickerTrigger2`: 1.5ms
      * `CreatePage`: 1.4ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `BrowserRouter`: 41.5ms
      * `Router`: 41.1ms
      * `AuthProvider`: 41.0ms
  * **Commit #363** tại **140.7s**: Render = **22.1ms**, Passive Effect = **267.8ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.9ms
      * `CreatePage`: 0.8ms
      * `CSSTransition2`: 0.7ms
      * `Routes`: 0.7ms
      * `Location.Provider`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 22.1ms
      * `ForwardRef(Anonymous)`: 21.3ms
      * `CSSTransition2`: 16.3ms
  * **Commit #368** tại **142.0s**: Render = **17.1ms**, Passive Effect = **0.1ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.9ms
      * `Routes`: 0.9ms
      * `Routes`: 0.8ms
      * `Routes`: 0.6ms
      * `Transition2`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 17.1ms
      * `ForwardRef(Anonymous)`: 16.5ms
      * `CSSTransition2`: 10.7ms
  * **Commit #369** tại **143.5s**: Render = **16.0ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 1.0ms
      * `Routes`: 0.7ms
      * `.$/create`: 0.6ms
      * `Routes`: 0.6ms
      * `Transition2`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 16.0ms
      * `ForwardRef(Anonymous)`: 15.7ms
      * `.$/create`: 10.8ms
  * **Commit #370** tại **143.6s**: Render = **15.9ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.7ms
      * `CSSTransition2`: 0.7ms
      * `Context.Provider`: 0.7ms
      * `RenderedRoute`: 0.6ms
      * `Routes`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 15.9ms
      * `ForwardRef(Anonymous)`: 15.4ms
      * `.$/create`: 10.9ms
  * **Commit #371** tại **143.6s**: Render = **16.6ms**, Passive Effect = **38.5ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 0.8ms
      * `Trigger2`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.8ms
      * `.$/create`: 0.7ms
      * `Routes`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `ForwardRef(Anonymous)`: 16.6ms
      * `CreatePage`: 16.6ms
      * `CSSTransition2`: 10.0ms
  * **Commit #372** tại **143.7s**: Render = **17.1ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `.$/create`: 0.8ms
      * `passwordIcon`: 0.8ms
      * `Context.Provider`: 0.7ms
      * `Routes`: 0.7ms
      * `Location.Provider`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 17.1ms
      * `ForwardRef(Anonymous)`: 16.9ms
      * `.$/create`: 10.6ms

### 🎬 Giai đoạn: QR Focus View & Mở QR Modal (145s - 160s)
- **Số lượng Commits:** 33
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 3
- **Chi tiết các commits nghẽn:**
  * **Commit #373** tại **146.2s**: Render = **18.5ms**, Passive Effect = **0.2ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 0.8ms
      * `.$/create`: 0.8ms
      * `Routes`: 0.8ms
      * `Transition2`: 0.7ms
      * `Trigger2`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `ForwardRef(Anonymous)`: 18.5ms
      * `CreatePage`: 18.5ms
      * `CSSTransition2`: 10.0ms
  * **Commit #378** tại **146.5s**: Render = **16.6ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `.$/create`: 3.1ms
      * `Routes`: 0.9ms
      * `Routes`: 0.9ms
      * `.$/create`: 0.7ms
      * `Context.Provider`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 16.6ms
      * `ForwardRef(Anonymous)`: 16.5ms
      * `CSSTransition2`: 13.3ms
  * **Commit #382** tại **154.4s**: Render = **23.8ms**, Passive Effect = **1.6ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 1.7ms
      * `Routes`: 1.1ms
      * `Routes`: 1.1ms
      * `ForwardRef(Anonymous)`: 1.0ms
      * `ForwardRef(Anonymous)`: 0.9ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `BrowserRouter`: 23.8ms
      * `AuthProvider`: 23.5ms
      * `Location.Provider`: 23.5ms

### 🎬 Giai đoạn: Edit thông tin & Lưu (160s - 175s)
- **Số lượng Commits:** 50
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 15
- **Chi tiết các commits nghẽn:**
  * **Commit #412** tại **163.9s**: Render = **36.8ms**, Passive Effect = **265.4ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `static`: 3.1ms
      * `Routes`: 1.1ms
      * `Transition2`: 0.9ms
      * `Transition2`: 0.8ms
      * `BaseInput2`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `BrowserRouter`: 36.8ms
      * `Router`: 36.7ms
      * `AnimationRoutes2`: 36.0ms
  * **Commit #419** tại **164.5s**: Render = **20.2ms**, Passive Effect = **248.3ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.8ms
      * `Location.Provider`: 0.7ms
      * `Routes`: 0.7ms
      * `Location.Provider`: 0.6ms
      * `Routes`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 20.2ms
      * `ForwardRef(Anonymous)`: 19.6ms
      * `CSSTransition2`: 14.8ms
  * **Commit #420** tại **165.1s**: Render = **18.2ms**, Passive Effect = **0.3ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CreatePage`: 0.9ms
      * `InputFormField`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.7ms
      * `.$/create`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 18.2ms
      * `ForwardRef(Anonymous)`: 17.3ms
      * `CSSTransition2`: 11.1ms
  * **Commit #423** tại **165.7s**: Render = **18.2ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 1.0ms
      * `.$/create`: 0.9ms
      * `Location.Provider`: 0.9ms
      * `Routes`: 0.8ms
      * `Trigger2`: 0.8ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 18.2ms
      * `ForwardRef(Anonymous)`: 17.4ms
      * `CSSTransition2`: 12.7ms
  * **Commit #428** tại **166.6s**: Render = **15.9ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.9ms
      * `Trigger2`: 0.9ms
      * `Routes`: 0.8ms
      * `Routes`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.8ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `ForwardRef(Anonymous)`: 15.9ms
      * `CreatePage`: 15.9ms
      * `.$/create`: 9.9ms
  * **Commit #429** tại **166.7s**: Render = **15.9ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `ForwardRef(Anonymous)`: 0.9ms
      * `Transition2`: 0.9ms
      * `ForwardRef(Anonymous)`: 0.9ms
      * `Routes`: 0.7ms
      * `Routes`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 15.9ms
      * `ForwardRef(Anonymous)`: 15.8ms
      * `CSSTransition2`: 10.9ms
  * **Commit #430** tại **166.7s**: Render = **16.9ms**, Passive Effect = **39.1ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 0.9ms
      * `.$/create`: 0.8ms
      * `.$/create`: 0.7ms
      * `Routes`: 0.7ms
      * `Routes`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 16.9ms
      * `ForwardRef(Anonymous)`: 16.5ms
      * `CSSTransition2`: 9.9ms
  * **Commit #431** tại **166.8s**: Render = **15.4ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.8ms
      * `CSSTransition2`: 0.7ms
      * `Routes`: 0.7ms
      * `CreatePage`: 0.7ms
      * `Routes`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 15.4ms
      * `ForwardRef(Anonymous)`: 14.7ms
      * `CSSTransition2`: 9.3ms
  * **Commit #432** tại **167.8s**: Render = **18.0ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 0.9ms
      * `Routes`: 0.8ms
      * `Transition2`: 0.8ms
      * `Routes`: 0.7ms
      * `RenderedRoute`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 18.0ms
      * `ForwardRef(Anonymous)`: 17.4ms
      * `.$/create`: 10.6ms
  * **Commit #437** tại **168.1s**: Render = **23.3ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `PickerTrigger2`: 1.8ms
      * `CSSTransition2`: 1.3ms
      * `ForwardRef(Anonymous)`: 1.2ms
      * `ForwardRef(Anonymous)`: 0.9ms
      * `Routes`: 0.9ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 23.3ms
      * `ForwardRef(Anonymous)`: 23.2ms
      * `CSSTransition2`: 15.4ms
  * **Commit #438** tại **168.2s**: Render = **15.4ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 1.3ms
      * `Transition2`: 0.7ms
      * `ForwardRef(Anonymous)`: 0.1ms
      * `Context.Provider`: 0.1ms
      * `ForwardRef(Anonymous)`: 0.0ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CSSTransition2`: 15.4ms
      * `ForwardRef(Anonymous)`: 1.8ms
      * `Transition2`: 0.8ms
  * **Commit #439** tại **168.2s**: Render = **15.4ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 1.3ms
      * `ForwardRef(Anonymous)`: 0.0ms
      * `Context.Provider`: 0.0ms
      * `Transition2`: 0.0ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CSSTransition2`: 15.4ms
      * `Context.Provider`: 0.3ms
      * `Transition2`: 0.3ms
  * **Commit #440** tại **168.6s**: Render = **15.4ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 1.3ms
      * `ForwardRef(Anonymous)`: 1.2ms
      * `Controller`: 0.1ms
      * `ForwardRef(Anonymous)`: 0.0ms
      * `CSSTransition2`: 0.0ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CSSTransition2`: 15.4ms
      * `ForwardRef(Anonymous)`: 1.4ms
      * `Transition2`: 0.1ms
  * **Commit #441** tại **169.4s**: Render = **40.5ms**, Passive Effect = **1.9ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `ForwardRef(Anonymous)`: 2.9ms
      * `CSSTransition2`: 2.5ms
      * `Routes`: 1.6ms
      * `Radio.Group`: 1.2ms
      * `Context.Provider`: 0.9ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `BrowserRouter`: 40.5ms
      * `Context.Provider`: 40.4ms
      * `AuthProvider`: 40.4ms
  * **Commit #447** tại **169.7s**: Render = **51.8ms**, Passive Effect = **39.5ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 38.8ms
      * `RenderedRoute`: 0.9ms
      * `CSSTransition2`: 0.8ms
      * `InputFormField`: 0.8ms
      * `InputFormField`: 0.8ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 51.8ms
      * `ForwardRef(Anonymous)`: 51.7ms
      * `.$/create`: 50.6ms

### 🎬 Giai đoạn: Quay về Danh sách QR (Lần 2) (175s - 185s)
- **Số lượng Commits:** 0
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 0
- **Đánh giá:** Chạy mượt mà, không xảy ra block Main Thread.

### 🎬 Giai đoạn: QR Focus View & Mở QR Modal (Lần 2) (185s - 210s)
- **Số lượng Commits:** 24
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 0
- **Đánh giá:** Chạy mượt mà, không xảy ra block Main Thread.

### 🎬 Giai đoạn: Edit QR với QREditor (Canvas/Konva) & Lưu (210s - 250s)
- **Số lượng Commits:** 35
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 6
- **Chi tiết các commits nghẽn:**
  * **Commit #483** tại **215.7s**: Render = **51.1ms**, Passive Effect = **36.6ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 42.1ms
      * `CSSTransition2`: 1.2ms
      * `ForwardRef(Anonymous)`: 0.7ms
      * `.$/create`: 0.7ms
      * `Controller`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Context.Provider`: 51.1ms
      * `Routes`: 51.0ms
      * `RenderedRoute`: 43.7ms
  * **Commit #485** tại **216.5s**: Render = **43.4ms**, Passive Effect = **35.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 36.9ms
      * `ForwardRef(Anonymous)`: 0.7ms
      * `CSSTransition2`: 0.7ms
      * `CSSTransition2`: 0.6ms
      * `CSSTransition2`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Context.Provider`: 43.4ms
      * `Routes`: 43.3ms
      * `RenderedRoute`: 38.8ms
  * **Commit #488** tại **219.5s**: Render = **43.2ms**, Passive Effect = **32.9ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 34.8ms
      * `Controller`: 1.2ms
      * `.$/create`: 0.9ms
      * `CreatePage`: 0.7ms
      * `ForwardRef(Anonymous)`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Context.Provider`: 43.2ms
      * `Routes`: 43.1ms
      * `RenderedRoute`: 36.8ms
  * **Commit #490** tại **222.9s**: Render = **45.1ms**, Passive Effect = **34.9ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 37.3ms
      * `ForwardRef(Anonymous)`: 1.0ms
      * `Context.Provider`: 0.9ms
      * `CreatePage`: 0.8ms
      * `CSSTransition2`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Context.Provider`: 45.1ms
      * `Routes`: 44.2ms
      * `RenderedRoute`: 38.6ms
  * **Commit #493** tại **226.2s**: Render = **42.4ms**, Passive Effect = **32.1ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 34.4ms
      * `ForwardRef(Anonymous)`: 0.9ms
      * `CSSTransition2`: 0.9ms
      * `ForwardRef(Anonymous)`: 0.8ms
      * `CSSTransition2`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Context.Provider`: 42.4ms
      * `Routes`: 42.3ms
      * `RenderedRoute`: 35.6ms
  * **Commit #500** tại **242.6s**: Render = **36.4ms**, Passive Effect = **19.8ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 22.4ms
      * `Anonymous`: 1.1ms
      * `RenderedRoute`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.8ms
      * `Transition2`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Anonymous`: 36.4ms
      * `Context.Provider`: 35.3ms
      * `Context.Provider`: 34.2ms

### 🎬 Giai đoạn: Quay về Danh sách QR (Lần 3 - Danh sách đã dài hơn) (250s - 260s)
- **Số lượng Commits:** 26
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** 10
- **Chi tiết các commits nghẽn:**
  * **Commit #518** tại **253.6s**: Render = **32.4ms**, Passive Effect = **17.9ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 20.2ms
      * `CreatePage`: 1.1ms
      * `ForwardRef(Anonymous)`: 0.9ms
      * `Transition2`: 0.9ms
      * `CSSTransition2`: 0.8ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 32.4ms
      * `ForwardRef(Anonymous)`: 31.3ms
      * `.$/create`: 30.2ms
  * **Commit #519** tại **253.7s**: Render = **49.4ms**, Passive Effect = **286.7ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `static`: 1.9ms
      * `Routes`: 1.4ms
      * `ForwardRef(Anonymous)`: 1.3ms
      * `Routes`: 1.1ms
      * `static`: 1.0ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `BrowserRouter`: 49.4ms
      * `Router`: 48.4ms
      * `AuthProvider`: 47.7ms
  * **Commit #520** tại **254.3s**: Render = **241.3ms**, Passive Effect = **0.8ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `RenderedRoute`: 234.3ms
      * `ForwardRef(Anonymous)`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.8ms
      * `CSSTransition2`: 0.8ms
      * `SelectFormField`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `Context.Provider`: 241.3ms
      * `Transition2`: 241.3ms
      * `CreatePage`: 238.3ms
  * **Commit #530** tại **254.9s**: Render = **21.6ms**, Passive Effect = **266.1ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.8ms
      * `Trigger2`: 0.8ms
      * `Controller`: 0.8ms
      * `.$/create`: 0.7ms
      * `ForwardRef(Anonymous)`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 21.6ms
      * `ForwardRef(Anonymous)`: 21.4ms
      * `CSSTransition2`: 16.1ms
  * **Commit #531** tại **255.5s**: Render = **17.6ms**, Passive Effect = **0.7ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 1.0ms
      * `WifiForm`: 1.0ms
      * `Routes`: 0.8ms
      * `Context.Provider`: 0.8ms
      * `BaseInput2`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 17.6ms
      * `ForwardRef(Anonymous)`: 17.3ms
      * `CSSTransition2`: 11.7ms
  * **Commit #532** tại **256.2s**: Render = **15.7ms**, Passive Effect = **0.8ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `UploadFormField`: 0.9ms
      * `RenderedRoute`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.7ms
      * `.$/create`: 0.7ms
      * `.$/create`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 15.7ms
      * `ForwardRef(Anonymous)`: 15.0ms
      * `.$/create`: 10.1ms
  * **Commit #537** tại **257.4s**: Render = **15.6ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.9ms
      * `Routes`: 0.8ms
      * `Routes`: 0.8ms
      * `ForwardRef(Anonymous)`: 0.7ms
      * `Context.Provider`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `ForwardRef(Anonymous)`: 15.6ms
      * `CreatePage`: 15.6ms
      * `.$/create`: 10.7ms
  * **Commit #538** tại **257.5s**: Render = **16.3ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `Routes`: 0.9ms
      * `passwordIcon`: 0.8ms
      * `Routes`: 0.7ms
      * `.$/create`: 0.6ms
      * `Transition2`: 0.6ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 16.3ms
      * `ForwardRef(Anonymous)`: 16.0ms
      * `CSSTransition2`: 11.2ms
  * **Commit #539** tại **257.5s**: Render = **16.7ms**, Passive Effect = **32.4ms** (Độ ưu tiên: Immediate)
    - *Top components tốn thời gian render (Self):*
      * `CreatePage`: 0.9ms
      * `RenderedRoute`: 0.8ms
      * `Transition2`: 0.8ms
      * `Transition2`: 0.8ms
      * `Routes`: 0.7ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `CreatePage`: 16.7ms
      * `ForwardRef(Anonymous)`: 15.8ms
      * `CSSTransition2`: 9.5ms
  * **Commit #540** tại **257.6s**: Render = **15.7ms**, Passive Effect = **0.0ms** (Độ ưu tiên: Normal)
    - *Top components tốn thời gian render (Self):*
      * `CSSTransition2`: 0.9ms
      * `Transition2`: 0.8ms
      * `Trigger2`: 0.6ms
      * `Routes`: 0.5ms
      * `Location.Provider`: 0.5ms
    - *Top components tốn thời gian mount/update (Actual):*
      * `ForwardRef(Anonymous)`: 15.7ms
      * `CreatePage`: 15.7ms
      * `CSSTransition2`: 9.8ms

