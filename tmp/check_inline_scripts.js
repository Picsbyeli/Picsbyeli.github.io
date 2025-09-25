const fs = require('fs');
const path = require('path');
const htmlPath = path.resolve(__dirname, '../standalone.html');
const outDir = path.resolve(__dirname);
const html = fs.readFileSync(htmlPath,'utf8');
const re = /<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi;
let m; let idx=0; const files=[];
while ((m=re.exec(html)) !== null) {
  idx++; const inner = m[1];
  const fn = path.join(outDir, `script-${idx}.js`);
  fs.writeFileSync(fn, inner, 'utf8');
  files.push(fn);
}
console.log('wrote', files.length, 'script files');
files.forEach(f=>console.log(f));
