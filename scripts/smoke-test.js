const fs = require("fs");
const path = require("path");
const assert = require("assert");

const root = path.resolve(__dirname, "..");
const distModern = path.join(root, "dist", "p5.zine.js");
const distLegacy = path.join(root, "dist", "p5.zine.legacy.js");
const testModern = path.join(root, "test", "index.html");
const testLegacy = path.join(root, "test", "index.legacy.html");

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

assert.ok(fileExists(distModern), "dist/p5.zine.js does not exist. Run npm run build first.");
assert.ok(fileExists(distLegacy), "dist/p5.zine.legacy.js does not exist. Run npm run build first.");

const modernStat = fs.statSync(distModern);
const legacyStat = fs.statSync(distLegacy);
assert.ok(modernStat.size > 0, "dist/p5.zine.js is empty.");
assert.ok(legacyStat.size > 0, "dist/p5.zine.legacy.js is empty.");

const modernContent = fs.readFileSync(distModern, "utf8");
const legacyContent = fs.readFileSync(distLegacy, "utf8");
assert.ok(
  modernContent.includes("p5.zine"),
  "dist/p5.zine.js does not include expected library banner/string."
);
assert.ok(
  legacyContent.includes("p5.zine"),
  "dist/p5.zine.legacy.js does not include expected library banner/string."
);

assert.ok(fileExists(testModern), "test/index.html is missing.");
assert.ok(fileExists(testLegacy), "test/index.legacy.html is missing.");

const testModernHtml = fs.readFileSync(testModern, "utf8");
const testLegacyHtml = fs.readFileSync(testLegacy, "utf8");
assert.ok(
  testModernHtml.includes("../dist/p5.zine.js"),
  "test/index.html does not reference ../dist/p5.zine.js."
);
assert.ok(
  testLegacyHtml.includes("../dist/p5.zine.legacy.js"),
  "test/index.legacy.html does not reference ../dist/p5.zine.legacy.js."
);

console.log("Smoke test passed ✅");
