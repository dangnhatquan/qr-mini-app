const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

const strings = [""];
let stringIndex = 1;
const fibers = new Map();
const opCounts = {};

for (let opIdx = 0; opIdx < 358; opIdx++) {
  const opArray = root.operations[opIdx];
  if (!opArray) continue;
  let i = 2;
  const numStrings = opArray[i++];
  for (let s = 0; s < numStrings; s++) {
    const length = opArray[i++];
    let str = '';
    for (let c = 0; c < length; c++) {
      str += String.fromCharCode(opArray[i++]);
    }
    strings.push(str);
  }
  
  while (i < opArray.length) {
    const op = opArray[i++];
    opCounts[op] = (opCounts[op] || 0) + 1;
    if (op === 1) { // ADD
      const id = opArray[i++];
      const type = opArray[i++];
      const parentId = opArray[i++];
      const ownerId = opArray[i++];
      const nameId = opArray[i++];
      const keyId = opArray[i++];
      fibers.set(id, { id, type, parentId, ownerId, name: strings[nameId] });
    } else if (op === 2) { // REMOVE
      const count = opArray[i++];
      for (let c = 0; c < count; c++) {
        const id = opArray[i++];
        fibers.delete(id);
      }
    } else if (op === 3) { // REORDER
      const id = opArray[i++];
      const count = opArray[i++];
      i += count;
    } else if (op === 4) { // UPDATE BASE DURATION
      const id = opArray[i++];
      const duration = opArray[i++];
    }
  }
}

console.log('Op counts in first 358 arrays:', opCounts);
console.log('Fibers count in map before array 358:', fibers.size);
if (fibers.size > 0) {
  console.log('Sample fibers in map:', Array.from(fibers.values()).slice(0, 10));
}
