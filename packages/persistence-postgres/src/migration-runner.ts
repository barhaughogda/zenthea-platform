/**
 * Manual Migration Runner
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * A minimal, deterministic migration runner for applying SQL migrations.
 * No auto-migration, no magic - explicit execution only.
 *
 * INVARIANTS:
 * - Migrations are applied in order (sorted by filename)
 * - Each migration is applied exactly once (tracked in schema_migrations)
 * - Failed migrations cause immediate abort
 * - No rollback support (intentional - roll forward only)
 *
 * Usage:
 *   DATABASE_URL=postgres://... pnpm migrate
 *   DATABASE_URL=postgres://... pnpm migrate --dry-run
 */

import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { Pool } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MigrationFile {
  version: string;
  filename: string;
  path: string;
}

interface AppliedMigration {
  version: string;
  applied_at: Date;
  checksum: string;
}

/**
 * Computes SHA256 checksum of migration content.
 */
function computeChecksum(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

/**
 * Discovers migration files in the migrations directory.
 */
async function discoverMigrations(): Promise<MigrationFile[]> {
  const migrationsDir = join(__dirname, "..", "migrations");
  const files = await readdir(migrationsDir);

  const migrations: MigrationFile[] = files
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((filename) => {
      // Extract version from filename (e.g., "001_init.sql" -> "001")
      const match = filename.match(/^(\d+)/);
      const version = match ? match[1] : filename;
      return {
        version: version ?? filename,
        filename,
        path: join(migrationsDir, filename),
      };
    });

  return migrations;
}

/**
 * Gets list of already applied migrations from the database.
 */
async function getAppliedMigrations(pool: Pool): Promise<AppliedMigration[]> {
  // First, ensure the schema_migrations table exists
  // This is the only "auto" behavior - creating the tracking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version     TEXT PRIMARY KEY,
      applied_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      checksum    TEXT NOT NULL
    )
  `);

  const result = await pool.query<AppliedMigration>(
    "SELECT version, applied_at, checksum FROM schema_migrations ORDER BY version"
  );

  return result.rows;
}

/**
 * Applies a single migration within a transaction.
 */
async function applyMigration(
  pool: Pool,
  migration: MigrationFile,
  dryRun: boolean
): Promise<void> {
  const content = await readFile(migration.path, "utf8");
  const checksum = computeChecksum(content);

  console.log(`  Applying: ${migration.filename}`);
  console.log(`  Checksum: ${checksum.substring(0, 16)}...`);

  if (dryRun) {
    console.log("  [DRY RUN] Would execute migration");
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Execute the migration SQL
    await client.query(content);

    // Record the migration
    await client.query(
      "INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)",
      [migration.version, checksum]
    );

    await client.query("COMMIT");
    console.log("  Applied successfully\n");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main migration runner.
 */
async function runMigrations(): Promise<void> {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL environment variable is required");
    process.exit(1);
  }

  const dryRun = process.argv.includes("--dry-run");
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    console.log("PostgreSQL Migration Runner");
    console.log("===========================\n");

    if (dryRun) {
      console.log("MODE: Dry Run (no changes will be made)\n");
    }

    // Discover available migrations
    const availableMigrations = await discoverMigrations();
    console.log(`Found ${availableMigrations.length} migration file(s)\n`);

    // Get already applied migrations
    const appliedMigrations = await getAppliedMigrations(pool);
    const appliedVersions = new Set(appliedMigrations.map((m) => m.version));

    console.log(`Already applied: ${appliedMigrations.length} migration(s)\n`);

    // Determine pending migrations
    const pendingMigrations = availableMigrations.filter(
      (m) => !appliedVersions.has(m.version)
    );

    if (pendingMigrations.length === 0) {
      console.log("No pending migrations. Database is up to date.");
      return;
    }

    console.log(`Pending: ${pendingMigrations.length} migration(s)\n`);

    // Verify checksums of already applied migrations
    for (const applied of appliedMigrations) {
      const migration = availableMigrations.find(
        (m) => m.version === applied.version
      );
      if (migration) {
        const content = await readFile(migration.path, "utf8");
        const currentChecksum = computeChecksum(content);
        if (currentChecksum !== applied.checksum) {
          console.error(
            `ERROR: Checksum mismatch for migration ${applied.version}`
          );
          console.error(`  Expected: ${applied.checksum}`);
          console.error(`  Current:  ${currentChecksum}`);
          console.error(
            "\nMigration files must not be modified after being applied."
          );
          process.exit(1);
        }
      }
    }

    // Apply pending migrations in order
    for (const migration of pendingMigrations) {
      await applyMigration(pool, migration, dryRun);
    }

    console.log("Migration complete.");
  } catch (error) {
    console.error("\nMigration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if executed directly
runMigrations().catch(console.error);
