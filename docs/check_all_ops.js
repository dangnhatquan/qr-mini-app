const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

const strings = [""];
let stringIndex = 1;
const fibers = new Map();
const opCounts = {};

// Build name map from initial snapshots first
const snapshots = root.snapshots;
for (const key of Object.keys(snapshots)) {
  const item = snapshots[key];
  const id = item[0];
  const meta = item[1];
  if (meta) {
    fibers.set(id, { id, type: meta.type, parentId: null, ownerId: null, name: meta.displayName || `Unnamed_${meta.type}` });
  }
}
console.log('Initial fibers loaded from snapshots:', fibers.size);

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
      
      const name = strings[nameId] || `Unnamed_${type}`;
      fibers.set(id, { id, type, parentId, ownerId, name });
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
    } else if (op === 11) { // Custom/new operation code 11
      const arg1 = opArray[i++];
      const numBlocks = opArray[i++];
      i += numBlocks * 4; // skip blocks of size 4
    } else {
      console.log(`Op Array ${opIdx}: found unknown code ${op} at position ${i-1}/${opArray.length}. Surrounding:`, opArray.slice(Math.max(0, i-5), Math.min(opArray.length, i+15)));
      break;
    }
  }
});

console.log('All operations processed successfully!');
console.log('Total fibers in final map:', fibers.size);
console.log('Operation code counts:', opCounts);
