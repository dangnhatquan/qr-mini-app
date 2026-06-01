const fs = require('fs');
const path = require('path');

const filePathArg = process.argv[2];
const outputNameArg = process.argv[3];

const filePath = filePathArg ? path.resolve(filePathArg) : path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const outputReportPath = outputNameArg ? path.resolve(outputNameArg) : path.join(__dirname, 'profiler_analysis_report.md');

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

const strings = [""];
const fibers = new Map();

// Initialize with snapshots
const snapshots = root.snapshots;
for (const key of Object.keys(snapshots)) {
  const item = snapshots[key];
  const id = item[0];
  const meta = item[1];
  if (meta) {
    fibers.set(id, {
      id,
      type: meta.type,
      parentId: null,
      ownerId: null,
      name: meta.displayName || `Unnamed_${meta.type}`
    });
  }
}

// Parse operations to reconstruct dynamically mounted fibers
root.operations.forEach((opArray, opIdx) => {
  let i = 2; // skip root, renderer
  if (i >= opArray.length) return;
  
  const stringTableSize = opArray[i++];
  const stringTableEnd = i + stringTableSize;
  while (i < stringTableEnd && i < opArray.length) {
    const length = opArray[i++];
    let str = '';
    for (let c = 0; c < length; c++) {
      str += String.fromCharCode(opArray[i++]);
    }
    strings.push(str);
  }
  
  // Make sure i is exactly at stringTableEnd
  i = stringTableEnd;
  
  while (i < opArray.length) {
    const op = opArray[i++];
    if (op === 1) { // ADD
      const id = opArray[i++];
      const type = opArray[i++];
      const parentId = opArray[i++];
      const ownerId = opArray[i++];
      const nameId = opArray[i++];
      const keyId = opArray[i++];
      const extra = opArray[i++]; // skip extra
      
      const name = strings[nameId] || `Unnamed_${type}`;
      fibers.set(id, { id, type, parentId, ownerId, name });
    } else if (op === 2) { // REMOVE
      const count = opArray[i++];
      for (let c = 0; c < count; c++) {
        const id = opArray[i++];
        // Keep in map so we can resolve component names for past commits!
      }
    } else if (op === 3) { // REORDER
      const id = opArray[i++];
      const count = opArray[i++];
      i += count;
    } else if (op === 4) { // UPDATE BASE DURATION
      const id = opArray[i++];
      const duration = opArray[i++];
    } else if (op === 11) { // Custom op
      const arg1 = opArray[i++];
      const numBlocks = opArray[i++];
      i += numBlocks * 4;
    } else {
      break;
    }
  }
});

console.log(`Reconstructed total fibers registry (including unmounted): ${fibers.size}`);

// Process commits
const commits = root.commitData.map((c, idx) => {
  const selfDurations = c.fiberSelfDurations.map(([id, dur]) => {
    const fiber = fibers.get(id);
    return { id, name: fiber ? fiber.name : `Unknown_${id}`, duration: dur };
  });
  
  const actualDurations = c.fiberActualDurations.map(([id, dur]) => {
    const fiber = fibers.get(id);
    return { id, name: fiber ? fiber.name : `Unknown_${id}`, duration: dur };
  });

  // Find the top component in this commit
  selfDurations.sort((a, b) => b.duration - a.duration);
  actualDurations.sort((a, b) => b.duration - a.duration);

  return {
    index: idx,
    timestamp: c.timestamp,
    duration: c.duration,
    passiveEffectDuration: c.passiveEffectDuration || 0,
    effectDuration: c.effectDuration || 0,
    priorityLevel: c.priorityLevel,
    topSelfComponents: selfDurations.slice(0, 5),
    topActualComponents: actualDurations.slice(0, 5)
  };
});

// Identify significant bottlenecks
const expensiveCommits = commits.filter(c => c.duration > 15 || c.passiveEffectDuration > 30);

console.log(`Found ${expensiveCommits.length} expensive commits out of ${commits.length}`);

// Write a beautiful markdown report
let report = `# Báo cáo Phân tích React Profiler Trace (Case Full Flow)

## 📌 Thông tin chung
- **Thời gian profiling:** ~260 giây (tổng cộng ${commits.length} commits).
- **Tổng số components ghi nhận:** ${fibers.size}.
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
`;

expensiveCommits.forEach(c => {
  const topComp = c.topSelfComponents[0] ? `${c.topSelfComponents[0].name} (${c.topSelfComponents[0].duration.toFixed(1)}ms)` : 'N/A';
  report += `| #${c.index} | ${(c.timestamp / 1000).toFixed(1)}s | ${c.duration.toFixed(1)}ms | ${c.passiveEffectDuration.toFixed(1)}ms | ${c.priorityLevel} | ${topComp} |\n`;
});

report += `
---

## 🔍 Chi tiết Phân tích các Giai đoạn chính (Flow Breakdown)

`;

// Let's divide timestamps to make sense of the flow
// We can output groups of commits that represent page loads or actions.
const groups = [
  { name: "Khởi động & Danh sách QR ban đầu", start: 0, end: 15 },
  { name: "Tạo QR động & Chọn thiệp điện tử", start: 15, end: 100 },
  { name: "Tạo thiệp, Lưu thiệp & Lưu QR", start: 100, end: 135 },
  { name: "Quay về Danh sách QR (Lần 1)", start: 135, end: 145 },
  { name: "QR Focus View & Mở QR Modal", start: 145, end: 160 },
  { name: "Edit thông tin & Lưu", start: 160, end: 175 },
  { name: "Quay về Danh sách QR (Lần 2)", start: 175, end: 185 },
  { name: "QR Focus View & Mở QR Modal (Lần 2)", start: 185, end: 210 },
  { name: "Edit QR với QREditor (Canvas/Konva) & Lưu", start: 210, end: 250 },
  { name: "Quay về Danh sách QR (Lần 3 - Danh sách đã dài hơn)", start: 250, end: 260 }
];

groups.forEach(g => {
  const inGroup = commits.filter(c => (c.timestamp / 1000) >= g.start && (c.timestamp / 1000) < g.end);
  const expensiveInGroup = inGroup.filter(c => c.duration > 15 || c.passiveEffectDuration > 30);
  
  report += `### 🎬 Giai đoạn: ${g.name} (${g.start}s - ${g.end}s)
- **Số lượng Commits:** ${inGroup.length}
- **Số commit bị nghẽn (render > 15ms hoặc effect > 30ms):** ${expensiveInGroup.length}
`;
  
  if (expensiveInGroup.length > 0) {
    report += `- **Chi tiết các commits nghẽn:**\n`;
    expensiveInGroup.forEach(c => {
      report += `  * **Commit #${c.index}** tại **${(c.timestamp/1000).toFixed(1)}s**: Render = **${c.duration.toFixed(1)}ms**, Passive Effect = **${c.passiveEffectDuration.toFixed(1)}ms** (Độ ưu tiên: ${c.priorityLevel})\n`;
      report += `    - *Top components tốn thời gian render (Self):*\n`;
      c.topSelfComponents.forEach(comp => {
        report += `      * \`${comp.name}\`: ${comp.duration.toFixed(1)}ms\n`;
      });
      report += `    - *Top components tốn thời gian mount/update (Actual):*\n`;
      c.topActualComponents.slice(0, 3).forEach(comp => {
        report += `      * \`${comp.name}\`: ${comp.duration.toFixed(1)}ms\n`;
      });
    });
  } else {
    report += `- **Đánh giá:** Chạy mượt mà, không xảy ra block Main Thread.\n`;
  }
  report += `\n`;
});

fs.writeFileSync(outputReportPath, report, 'utf8');
console.log(`Report generated at ${outputReportPath} successfully.`);
