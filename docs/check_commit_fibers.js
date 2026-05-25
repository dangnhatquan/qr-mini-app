const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

const c519 = root.commitData[519];
console.log('Commit 519 fiberSelfDurations count:', c519.fiberSelfDurations.length);
console.log('Commit 519 fiberSelfDurations sample:', c519.fiberSelfDurations.slice(0, 30));

// Check if any of these fiber IDs are in snapshots
const snapshots = root.snapshots;
const snapshotIds = new Set();
for (const key of Object.keys(snapshots)) {
  snapshotIds.add(snapshots[key][0]);
}

const foundInSnapshots = [];
const notFoundInSnapshots = [];

c519.fiberSelfDurations.forEach(([id, dur]) => {
  if (snapshotIds.has(id)) {
    foundInSnapshots.push(id);
  } else {
    notFoundInSnapshots.push(id);
  }
});

console.log(`Found in snapshots: ${foundInSnapshots.length}`);
console.log(`Not found in snapshots: ${notFoundInSnapshots.length}`);
console.log(`Sample not found in snapshots IDs:`, notFoundInSnapshots.slice(0, 30));
