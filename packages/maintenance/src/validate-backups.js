import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../../');
const SERVICES_DIR = path.join(ROOT_DIR, 'services');

function validateServices() {
  if (!fs.existsSync(SERVICES_DIR)) {
    console.error('Services directory not found');
    process.exit(1);
  }

  const services = fs.readdirSync(SERVICES_DIR).filter(file => {
    return fs.statSync(path.join(SERVICES_DIR, file)).isDirectory();
  });

  let hasErrors = false;
  let hasWarnings = false;

  console.log('Checking backup and recovery configurations for services...');

  for (const service of services) {
    const servicePath = path.join(SERVICES_DIR, service);
    const readmePath = path.join(servicePath, 'README.md');

    if (!fs.existsSync(readmePath)) {
      console.warn(`[WARNING] Service "${service}" is missing a README.md`);
      hasWarnings = true;
      continue;
    }

    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    const hasBackupSection = /## Backup and Recovery/i.test(readmeContent);
    const hasBackupScope = /Backup Scope/i.test(readmeContent);
    const hasRestoreProcedure = /Restore Procedure/i.test(readmeContent) || /Restore Documentation/i.test(readmeContent);

    if (!hasBackupSection) {
      console.warn(`[WARNING] Service "${service}" is missing a "Backup and Recovery" section in README.md`);
      hasWarnings = true;
    } else {
      if (!hasBackupScope) {
        console.warn(`[WARNING] Service "${service}" has a Backup and Recovery section but is missing "Backup Scope" declaration`);
        hasWarnings = true;
      }
      if (!hasRestoreProcedure) {
        console.warn(`[WARNING] Service "${service}" has a Backup and Recovery section but is missing "Restore Procedure" documentation`);
        hasWarnings = true;
      }
    }
  }

  if (hasWarnings) {
    console.log('\nBackup validation finished with warnings. Please ensure all services document backup and recovery.');
  } else {
    console.log('\nAll services have documented backup and recovery configurations.');
  }

  // Always exit with 0 as these are warnings, not errors.
  process.exit(0);
}

validateServices();
