const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const root = data.dataForRoots[0];
console.log('Root 0 Keys:', Object.keys(root));

// Let's print out the fiber data / operations representation
console.log('Operations sample (first 20 elements):', root.operations.slice(0, 20));
console.log('InitialTreeBaseDurations size:', Object.keys(root.initialTreeBaseDurations).length);

// Let's check commit 519 and 520
const c519 = root.commitData[519];
console.log('\nCommit 519 Keys:', Object.keys(c519));
console.log('Commit 519 fiberSelfDurations:', c519.fiberSelfDurations.slice(0, 10));
console.log('Commit 519 fiberActualDurations:', c519.fiberActualDurations.slice(0, 10));
console.log('Commit 519 changeDescriptions:', c519.changeDescriptions ? c519.changeDescriptions.slice(0, 5) : 'None');

const c520 = root.commitData[520];
console.log('\nCommit 520 Keys:', Object.keys(c520));
console.log('Commit 520 fiberSelfDurations:', c520.fiberSelfDurations.slice(0, 10));
console.log('Commit 520 fiberActualDurations:', c520.fiberActualDurations.slice(0, 10));

// Let's find out how fiber IDs map to names. Is there a list of components or operations?
// Usually, React Profiler version 4/5 logs operations which encode fiber creation and renaming.
// Let's see if there is another way or if we can extract names from the operations array.
// Operations is a flat array of numbers. Let's look at its structure.
