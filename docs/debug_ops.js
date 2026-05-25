const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

// Let's decode strings first
const strings = [""];
let stringIndex = 1;

// We will build a fiber map to see what we can parse
const fibers = new Map();

root.operations.forEach((opArray, opIdx) => {
  let i = 2; // skip rootID, rendererID
  if (i >= opArray.length) return;
  
  const numStrings = opArray[i++];
  for (let s = 0; s < numStrings; s++) {
    const length = opArray[i++];
    let str = '';
    for (let c = 0; c < length; c++) {
      str += String.fromCharCode(opArray[i++]);
    }
    strings.push(str);
  }
  
  // Now let's scan operations
  const startOps = i;
  while (i < opArray.length) {
    const op = opArray[i++];
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
    } else {
      console.log(`Op Array ${opIdx}: found code ${op} at position ${i-1}/${opArray.length}. Surrounding elements:`, opArray.slice(Math.max(0, i-5), Math.min(opArray.length, i+15)));
      // Let's just skip the rest of this array to prevent infinite loop or wrong parsing
      break;
    }
  }
});

console.log(`Total fibers in map: ${fibers.size}`);
