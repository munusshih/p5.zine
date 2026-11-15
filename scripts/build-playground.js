const { constants, copyFileSync, mkdirSync } = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist", "p5-zine-playground");
mkdirSync(output, { recursive: true });

const files = {
  "index.html": "p5-zine-playground/index.html",
  "p5.min.js": "node_modules/p5/lib/p5.min.js",
  "p5.zine.full.js": "dist/p5.zine.full.js",
  "p5-LICENSE.txt": "node_modules/p5/license.txt",
  "p5.zine-LICENSE.txt": "LICENSE",
  "jsPDF-LICENSE.txt": "node_modules/jspdf/LICENSE",
};
for (const [name, source] of Object.entries(files)) {
  copyFileSync(path.join(root, source), path.join(output, name));
}

// Preserve drawings when the playground is rebuilt.
try {
  copyFileSync(
    path.join(root, "p5-zine-playground", "sketch.js"),
    path.join(output, "sketch.js"),
    constants.COPYFILE_EXCL,
  );
} catch (error) {
  if (error.code !== "EEXIST") throw error;
}

console.log(`Open ${path.join(output, "index.html")} in your browser.`);
