const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

const opArray0 = root.operations[0];
const stringTableLimit = 3 + 347; // 350
console.log('Array length:', opArray0.length);
console.log('Operations slice (350 to 500):');
console.log(opArray0.slice(350, 500));

// Let's decode strings from the string table first
const stringsByOffset = new Map();
let i = 3;
while (i < stringTableLimit) {
  const startOffset = i;
  const length = opArray0[i++];
  let str = '';
  for (let c = 0; c < length; c++) {
    str += String.fromCharCode(opArray0[i++]);
  }
  stringsByOffset.set(startOffset, str);
}

console.log('\nDecoded strings by array offset:');
for (const [offset, str] of stringsByOffset) {
  console.log(`  Offset ${offset}: "${str}"`);
}
