import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");

// Используются команды Node.js, работающие и в Windows, и на GitHub Actions (Ubuntu).
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of ["index.html", "style.css", "script.js"]) {
  await cp(join(root, file), join(output, file));
}
await cp(join(root, "images"), join(output, "images"), { recursive: true });
console.log("Production build ready: dist/");
