const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const distPath = path.join(root, "dist", "p5.zine.js");
const testHtmlPath = path.join(root, "test", "index.html");

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

assert.ok(fileExists(distPath), "dist/p5.zine.js does not exist. Run npm run build first.");

const distStat = fs.statSync(distPath);
assert.ok(distStat.size > 0, "dist/p5.zine.js is empty.");

const distContent = fs.readFileSync(distPath, "utf8");
assert.ok(
  distContent.includes("p5.zine"),
  "dist/p5.zine.js does not include expected library banner/string."
);

assert.ok(fileExists(testHtmlPath), "test/index.html is missing.");
const testHtml = fs.readFileSync(testHtmlPath, "utf8");
assert.ok(
  testHtml.includes("../dist/p5.zine.js"),
  "test/index.html does not reference ../dist/p5.zine.js."
);

console.log("Smoke test passed ✅");
