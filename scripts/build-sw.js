import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '../dist');
const swPath = path.join(distPath, 'sw.js');

// Check if sw.js exists in dist
if (!fs.existsSync(swPath)) {
  console.error('[build-sw] Error: sw.js not found in dist/');
  process.exit(1);
}

// Read the sw.js file
let content = fs.readFileSync(swPath, 'utf8');

// Replace placeholder with actual build timestamp
const buildTimestamp = Date.now().toString();
content = content.replace(/__BUILD_TIMESTAMP__/g, buildTimestamp);

// Write back
fs.writeFileSync(swPath, content);

console.log(`[build-sw] Injected build timestamp: ${buildTimestamp}`);
