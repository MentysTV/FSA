import { runDatabaseSeed } from "../src/lib/seed";

async function main() {
  await runDatabaseSeed();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
