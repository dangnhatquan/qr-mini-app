const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const root = data.dataForRoots[0];
const strings = [""];
let stringIndex = 1;

root.operations.forEach((opArray, index) => {
  let i = 2; // skip rootID, rendererID
  if (i >= opArray.length) return;
  
  const numStrings = opArray[i++];
  console.log(`Op Array ${index} has ${numStrings} strings`);
  for (let s = 0; s < numStrings; s++) {
    if (i >= opArray.length) {
      console.log(`Error: Out of bounds at string ${s}/${numStrings}`);
      break;
    }
    const length = opArray[i++];
    let str = '';
    for (let c = 0; c < length; c++) {
      if (i >= opArray.length) {
        console.log(`Error: Out of bounds at char ${c}/${length}`);
        break;
      }
      str += String.fromCharCode(opArray[i++]);
    }
    strings.push(str);
  }
});

console.log('Total strings decoded:', strings.length - 1);
console.log('First 50 strings:', strings.slice(1, 51));
console.log('Last 50 strings:', strings.slice(-50));
