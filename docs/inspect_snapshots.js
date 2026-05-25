const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

console.log('snapshots type:', typeof root.snapshots);
if (root.snapshots) {
  const keys = Object.keys(root.snapshots);
  console.log('snapshots key count:', keys.length);
  if (keys.length > 0) {
    const firstKey = keys[0];
    console.log(`Snapshot for fiber ID ${firstKey}:`, root.snapshots[firstKey]);
  }
}
