import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const wrangler = resolve(root, 'node_modules/wrangler/bin/wrangler.js');
const bucket = process.argv[2] || 'dwn-testimonials-production';
if (!/^dwn-testimonials-(production|staging)$/.test(bucket)) throw new Error('Unexpected bucket.');

const pages = Array.from({ length: 34 }, (_, index) => String(index + 1).padStart(2, '0'));
const errors = [];
let next = 0;

function upload(page) {
  const file = resolve(root, `tmp/pdfs/dwn-testimonials/page-${page}.jpg`);
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
  return new Promise((done, fail) => {
    const child = spawn(process.execPath, [wrangler, 'r2', 'object', 'put',
      `${bucket}/source/page-${page}.jpg`, '--file', file, '--content-type', 'image/jpeg', '--remote'],
    { cwd: root, windowsHide: true });
    let output = '';
    child.stdout.on('data', chunk => { output += chunk; });
    child.stderr.on('data', chunk => { output += chunk; });
    child.on('error', fail);
    child.on('close', code => code === 0 ? done() : fail(new Error(`Page ${page}: ${output.slice(-300)}`)));
  });
}

async function worker() {
  while (next < pages.length) {
    const page = pages[next++];
    let success = false;
    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      try { await upload(page); success = true; console.log(`Uploaded page ${page}`); }
      catch (error) { if (attempt === 3) errors.push(String(error)); else await new Promise(resolve => setTimeout(resolve, attempt * 2000)); }
    }
  }
}

await Promise.all(Array.from({ length: 4 }, worker));
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
