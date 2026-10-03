import {readFile,access} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=new URL('../dist/',import.meta.url);
for(const file of ['index.html','styles.css','app.js','course.js','model.js','demos.js','activities.js'])await access(new URL(file,root));
for(const file of ['app.js','course.js','model.js','demos.js','activities.js'])execFileSync(process.execPath,['--check',fileURLToPath(new URL(file,root))]);
const html=await readFile(new URL('index.html',root),'utf8');
if(!html.includes('type="module"'))throw Error('Missing module entry');
console.log('Build validated. dist/ is the complete static production website.');
