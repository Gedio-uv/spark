/**
 * Builds data/questions.json from category bank modules.
 * Run: node scripts/build-questions.mjs
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import general from './banks/general.mjs';
import wyr from './banks/wyr.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const questions = [...general, ...wyr];

if (general.length !== 150) {
  console.error(`Expected 150 general questions, got ${general.length}`);
  process.exit(1);
}
if (wyr.length !== 150) {
  console.error(`Expected 150 would_you_rather questions, got ${wyr.length}`);
  process.exit(1);
}

writeFileSync(
  join(root, 'data/questions.json'),
  JSON.stringify({ questions }, null, 2) + '\n'
);

console.log(`Wrote ${questions.length} questions to data/questions.json`);
