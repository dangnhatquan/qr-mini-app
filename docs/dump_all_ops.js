const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

console.log('Operations count:', root.operations.length);
if (root.operations.length > 0) {
  const opArray0 = root.operations[0];
  console.log('opArray0 length:', opArray0.length);
  console.log('opArray0 sample (first 200 elements):', opArray0.slice(0, 200));
}
