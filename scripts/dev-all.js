const { spawn } = require("child_process");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function run(command, args) {
  return spawn(command, args, { stdio: "inherit" });
}

const procs = [
  run(npmCmd, ["run", "dev"]),
  run(npmCmd, ["run", "docs:dev"]),
];

function shutdown(signal) {
  procs.forEach((proc) => {
    if (proc && !proc.killed) {
      proc.kill(signal);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

procs.forEach((proc) => {
  proc.on("exit", (code, signal) => {
    if (signal) {
      shutdown(signal);
      process.exit(1);
    }
    if (code && code !== 0) {
      shutdown("SIGTERM");
      process.exit(code);
    }
  });
});
