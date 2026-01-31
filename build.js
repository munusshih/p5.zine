const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

// Define the banner content
const banner = `/* ==========================================================
 *
 * p5.zine
 * Copyright (c) 2026 Munus Shih, Tuan Huang, Iley Cao
 *
 * Licensed under GNU General Public License.
 * https://www.gnu.org/licenses
 ===========================================================*/`;

const args = new Set(process.argv.slice(2));
const isWatch = args.has("--watch");
const isServe = args.has("--serve");
const isDev = args.has("--dev") || isWatch || isServe;

const host = process.env.HOST || "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const maxPortAttempts = 20;

async function serveWithFallback(ctx, options) {
  let portToTry = options.port;
  for (let attempt = 0; attempt < maxPortAttempts; attempt += 1) {
    try {
      const server = await ctx.serve({ ...options, port: portToTry });
      return { server, port: portToTry };
    } catch (error) {
      const message = String(error?.message || error);
      if (message.includes("address already in use") || message.includes("EADDRINUSE")) {
        portToTry += 1;
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Unable to find an available port starting at ${options.port}.`);
}

const buildOptions = {
  entryPoints: {
    "p5.zine": "src/index.js",
    "p5.zine.full": "src/index.full.js",
  },
  bundle: true,
  minify: !isDev,
  sourcemap: isDev ? "inline" : false,
  outdir: "dist",
  legalComments: "inline",
  banner: {
    js: banner,
  },
  logLevel: "info",
  color: true,
  loader: {
    ".html": "text",
    ".css": "text",
  },
};

function removeStaleBundles() {
  const distDir = path.resolve(__dirname, "dist");
  const staleFiles = [
    "p5.zine.compat.js",
    "p5.zine.compat.full.js",
    "p5.zine.legacy.js",
    "p5.zine.legacy.full.js",
  ];
  staleFiles.forEach((file) => {
    const filePath = path.join(distDir, file);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      if (error && error.code !== "ENOENT") {
        console.warn(`⚠️ Failed to remove ${file}:`, error.message || error);
      }
    }
  });
}

async function run() {
  removeStaleBundles();
  if (!isWatch && !isServe) {
    try {
      await esbuild.build(buildOptions);
      console.log("Build successful! 🎉");
    } catch (error) {
      console.error("❌ Build failed: ", error);
      process.exit(1);
    }
    return;
  }

  const ctx = await esbuild.context(buildOptions);

  if (isServe) {
    const { server, port: servePort } = await serveWithFallback(ctx, {
      servedir: ".",
      host,
      port,
    });
    if (servePort !== port) {
      console.log(`Port ${port} is busy. Switched to ${servePort}.`);
    }
    console.log(
      `Serving on http://${server.host}:${server.port} (open /test/index.html or /test/index.legacy.html)`,
    );
  }

  if (isWatch) {
    await ctx.watch();
    console.log("Watching for changes...");
  }
}

run().catch((error) => {
  console.error("❌ Build failed: ", error);
  process.exit(1);
});
