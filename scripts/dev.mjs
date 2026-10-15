import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const host = valueAfter("--host", "127.0.0.1");
const port = valueAfter("--port", "3000");
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "-H", host, "-p", port], {
  stdio: "inherit",
  env: process.env
});

child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
