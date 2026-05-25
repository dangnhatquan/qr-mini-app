const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

// Build name map from snapshots
const idToName = new Map();
const snapshots = root.snapshots;
for (const key of Object.keys(snapshots)) {
  const item = snapshots[key];
  const id = item[0];
  const meta = item[1];
  if (meta) {
    idToName.set(id, meta.displayName || `Unnamed_${meta.type}`);
  }
}

console.log(`Fibers in snapshots: ${idToName.size}`);

// Check commits for missing fibers
const missingIds = new Set();
const allRenderFibers = new Set();

root.commitData.forEach((c) => {
  if (c.fiberSelfDurations) {
    c.fiberSelfDurations.forEach(([id]) => {
      allRenderFibers.add(id);
      if (!idToName.has(id)) {
        missingIds.add(id);
      }
    });
  }
  if (c.fiberActualDurations) {
    c.fiberActualDurations.forEach(([id]) => {
      allRenderFibers.add(id);
      if (!idToName.has(id)) {
        missingIds.add(id);
      }
    });
  }
});

console.log(`Total unique fibers in commits: ${allRenderFibers.size}`);
console.log(`Missing fiber IDs: ${missingIds.size}`);
if (missingIds.size > 0) {
  console.log('Sample missing IDs:', Array.from(missingIds).slice(0, 20));
}
