const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'profiling-data.05-25-2026.00-07-36.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const formatNum = (val) => {
  if (val === null || val === undefined) return 'N/A';
  return val.toFixed(1) + 'ms';
};

data.dataForRoots.forEach((root, idx) => {
  console.log(`\n================ Root ${idx}: ${root.displayName || 'Unnamed'} (ID: ${root.rootID}) ================`);
  console.log(`Commits: ${root.commitData.length}`);
  
  // Sort commits by duration
  const sortedByDuration = [...root.commitData]
    .map((c, i) => ({ ...c, originalIndex: i }))
    .sort((a, b) => (b.duration || 0) - (a.duration || 0));
    
  console.log('Top 5 longest commits by duration (render phase):');
  sortedByDuration.slice(0, 5).forEach((c) => {
    console.log(`  Commit #${c.originalIndex} at ${formatNum(c.timestamp)}: duration = ${formatNum(c.duration)}, passiveEffect = ${formatNum(c.passiveEffectDuration)}, priority = ${c.priorityLevel}`);
  });

  const sortedByPassiveEffect = [...root.commitData]
    .map((c, i) => ({ ...c, originalIndex: i }))
    .sort((a, b) => (b.passiveEffectDuration || 0) - (a.passiveEffectDuration || 0));
    
  console.log('Top 5 longest commits by passiveEffectDuration (useEffect cleanup/mount):');
  sortedByPassiveEffect.slice(0, 5).forEach((c) => {
    console.log(`  Commit #${c.originalIndex} at ${formatNum(c.timestamp)}: duration = ${formatNum(c.duration)}, passiveEffect = ${formatNum(c.passiveEffectDuration)}, priority = ${c.priorityLevel}`);
  });
});
