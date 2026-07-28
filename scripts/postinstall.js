import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

for (const dir of ['client', 'server']) {
  if (!existsSync(join(root, dir, 'node_modules'))) {
    execSync(`npm --prefix ${dir} install`, { cwd: root, stdio: 'inherit' });
  }
}
