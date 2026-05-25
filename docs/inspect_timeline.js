const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('timelineData length:', data.timelineData.length);
data.timelineData.forEach((tl, idx) => {
  console.log(`\nTimeline ${idx} keys:`, Object.keys(tl));
  if (tl.componentMeasures) {
    console.log(`  componentMeasures count:`, tl.componentMeasures.length);
    if (tl.componentMeasures.length > 0) {
      console.log(`  First componentMeasure:`, tl.componentMeasures[0]);
    }
  }
  if (tl.flamechart) {
    console.log(`  flamechart keys:`, Object.keys(tl.flamechart));
    if (tl.flamechart.rows) {
      console.log(`  flamechart rows count:`, tl.flamechart.rows.length);
    }
  }
});
