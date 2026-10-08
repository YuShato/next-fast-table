// Quick quality check of data.json before full rewrite
const data = require('./prisma/data.json');
console.log('Total:', data.length);

let undef = 0, nullFields = 0, weirdYear = 0;
for (const r of data) {
  if (String(r.userYear) === 'undefined') undef++;
  if (r.userYear === null || r.userYear === undefined) nullFields++;
  if (isNaN(Number(r.userYear))) weirdYear++;
}
console.log('rows with userYear="undefined":', undef);
console.log('rows with userYear null/undefined:', nullFields);
console.log('rows with non-numeric userYear:', weirdYear);

// Check id continuity
let gaps = 0;
for (let i = 1; i < data.length; i++) {
  if (data[i].id !== data[i - 1].id + 1) gaps++;
}
console.log('id gaps:', gaps);

// Check all fields present
const keys = Object.keys(data[0]);
console.log('keys:', keys.join(', '));

