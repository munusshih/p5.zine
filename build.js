const esbuild = require("esbuild");

// Define the banner content
const banner = `/* ==========================================================
 *
 * p5.zine
 * Copyright (c) 2024 Munus Shih, Tuan Huang, Iley Cao
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

const buildOptions = {
  entryPoints: ["src/index.js"],
  bundle: true,
  minify: !isDev,
  sourcemap: isDev ? "inline" : false,
  outfile: "dist/p5.zine.js",
  legalComments: "inline",
  banner: {
    js: banner,
  },
  logLevel: "info",
  color: true,
};

async function run() {
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
    const server = await ctx.serve({
      servedir: ".",
      host,
      port,
    });

    console.log(
      `Serving on http://${server.host}:${server.port} (open /test/index.html)`
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
