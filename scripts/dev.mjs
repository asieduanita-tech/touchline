import { spawn } from "node:child_process";

const incoming = process.argv.slice(2);
const args = [];
for (let index = 0; index < incoming.length; index += 1) {
  const value = incoming[index];
  if (value === "--strictPort") continue;
  if (value === "--host") {
    args.push("-H", incoming[index + 1] ?? "0.0.0.0");
    index += 1;
    continue;
  }
  args.push(value);
}

const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", ...args], {
  stdio: "inherit"
});
child.on("exit", (code) => process.exit(code ?? 0));
