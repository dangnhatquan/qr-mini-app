const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('dataForRoots length:', data.dataForRoots.length);
data.dataForRoots.forEach((root, idx) => {
  console.log(`Root ${idx} keys:`, Object.keys(root));
  if (root.commitData) {
    console.log(`  commitData length:`, root.commitData.length);
    if (root.commitData.length > 0) {
      console.log(`  First commitData keys:`, Object.keys(root.commitData[0]));
    }
  }
  if (root.snapshots) {
    console.log(`  snapshots size:`, root.snapshots.size || Object.keys(root.snapshots).length);
  }
  if (root.initialTreeBaseDurations) {
    console.log(`  initialTreeBaseDurations length:`, root.initialTreeBaseDurations.length);
  }
});

console.log('timelineData length:', data.timelineData.length);
data.timelineData.forEach((tl, idx) => {
  console.log(`Timeline ${idx} keys:`, Object.keys(tl));
});
