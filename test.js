import { readFile } from 'fs/promises';
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const jsonJobs = JSON.parse(await readFile(new URL('./utils/mockData.json', import.meta.url)));
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('op1', __dirname);
console.log('op2', fileURLToPath(import.meta.url));
console.log('op3', import.meta.url);
// // path.resolve(__dirname,
