const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

const snapshots = root.snapshots;
console.log('Sample snapshots mapping:');
let count = 0;
for (const key of Object.keys(snapshots)) {
  const item = snapshots[key];
  const id = item[0];
  const meta = item[1];
  if (meta && meta.displayName) {
    console.log(`Fiber ID ${id}: ${meta.displayName} (Type: ${meta.type})`);
    count++;
    if (count > 20) break;
  }
}
