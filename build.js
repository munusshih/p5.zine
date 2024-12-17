const esbuild = require("esbuild");
const fs = require("fs");
const path = require('path');

// Define the banner content
const banner = `/* ==========================================================
 *
 * p5.zine
 * Copyright (c) 2024 Munus Shih, Tuan Huang, Iley Cao
 *
 * Licensed under GNU General Public License.
 * https://www.gnu.org/licenses
 ===========================================================*/`;

// Run the esbuild bundling process
esbuild
  .build({
    entryPoints: ["src/index.js"],
    bundle: true,
    minify: true,
    outfile: "dist/p5.zine.js",
    legalComments: "inline",
    banner: {
      js: banner,
    },
    logLevel: 'info',
    color: true,
  })
  .then(() => {
    console.log('Build successful! 🎉');
  })
  .catch((error) => {
    console.error("❌ Build failed: ", error);
    process.exit(1);
  });
