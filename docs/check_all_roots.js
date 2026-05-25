const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

data.dataForRoots.forEach((root, idx) => {
  console.log(`\nRoot ${idx}: ${root.displayName || 'Unnamed'} (ID: ${root.rootID})`);
  console.log(`  Snapshots count: ${root.snapshots ? Object.keys(root.snapshots).length : 0}`);
  
  // Count ops
  let addCount = 0;
  let removeCount = 0;
  let reorderCount = 0;
  let updateDurationCount = 0;
  let customCount = 0;
  
  if (root.operations) {
    root.operations.forEach((opArray) => {
      let i = 2; // skip root, renderer
      if (i >= opArray.length) return;
      const numStrings = opArray[i++];
      i += numStrings; // skip strings info (wait, strings have lengths and chars, so we can't just add numStrings. We must parse them)
      
      // Let's use a try-catch parser for simplicity here just to count
      try {
        let stringIndex = 1;
        for (let s = 0; s < numStrings; s++) {
          const length = opArray[i++];
          i += length; // skip characters
        }
        
        while (i < opArray.length) {
          const op = opArray[i++];
          if (op === 1) {
            addCount++;
            i += 6; // id, type, parent, owner, name, key
          } else if (op === 2) {
            removeCount++;
            const count = opArray[i++];
            i += count;
          } else if (op === 3) {
            reorderCount++;
            const id = opArray[i++];
            const count = opArray[i++];
            i += count;
          } else if (op === 4) {
            updateDurationCount++;
            i += 2;
          } else if (op === 11) {
            customCount++;
            const arg1 = opArray[i++];
            const numBlocks = opArray[i++];
            i += numBlocks * 4;
          } else {
            // unknown op
            break;
          }
        }
      } catch (err) {
        // error
      }
    });
  }
  
  console.log(`  Ops: ADD=${addCount}, REMOVE=${removeCount}, REORDER=${reorderCount}, UPDATE_DUR=${updateDurationCount}, CUSTOM_11=${customCount}`);
  
  // Let's print out what types of fibers are in this root's snapshots
  if (root.snapshots && Object.keys(root.snapshots).length > 0) {
    const names = new Set();
    Object.values(root.snapshots).forEach((val) => {
      if (val && val[1] && val[1].displayName) {
        names.add(val[1].displayName);
      }
    });
    console.log(`  Snapshot component names (first 10):`, Array.from(names).slice(0, 10));
  }
});
