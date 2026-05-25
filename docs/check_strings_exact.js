const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const root = data.dataForRoots[0];

const opArray0 = root.operations[0];
let i = 2; // skip rootID, rendererID
const val3 = opArray0[i++];
console.log(`Third number (val3): ${val3}`);

const decodedStrings = [];
let prevI = i;
try {
  while (i < opArray0.length) {
    prevI = i;
    const length = opArray0[i++];
    if (length > 100 || length < 0) {
      console.log(`Potential end of strings at pointer ${prevI}, value is ${length}`);
      i = prevI; // backtrack
      break;
    }
    let str = '';
    for (let c = 0; c < length; c++) {
      str += String.fromCharCode(opArray0[i++]);
    }
    decodedStrings.push({ index: decodedStrings.length, str, startPtr: prevI });
  }
} catch (err) {
  console.log('Error during decoding:', err.message);
}

console.log(`Decoded strings:`);
decodedStrings.forEach((s) => {
  console.log(`  String #${s.index} (start: ${s.startPtr}): "${s.str}"`);
});

console.log(`Remaining elements at backtrack pointer ${i}: ${opArray0.length - i}`);
if (opArray0.length - i > 0) {
  console.log(`First 50 remaining elements:`, opArray0.slice(i, i + 50));
}
