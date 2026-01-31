const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src", "custom");
const outDir = path.join(root, "docs", "src", "data");
const outFile = path.join(outDir, "custom-functions.json");

function extractFrontmatter(content) {
  const start = content.indexOf("/*---");
  const end = content.indexOf("---*/");
  if (start === -1 || end === -1 || end <= start) {
    return "";
  }
  return content.slice(start + 5, end).trim();
}

function parseFrontmatter(text) {
  const lines = text.split(/\r?\n/);
  const data = {};
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (!line.startsWith(" ")) {
      const parts = line.split(/:\s*/);
      const key = parts[0].trim();
      const rest = parts.slice(1).join(": ").trim();

      if (rest === "|") {
        i += 1;
        const blockLines = [];
        while (i < lines.length && (lines[i].startsWith("  ") || lines[i].trim() === "")) {
          const blockLine = lines[i].startsWith("  ") ? lines[i].slice(2) : "";
          blockLines.push(blockLine);
          i += 1;
        }
        data[key] = blockLines.join("\n").replace(/\n+$/, "");
        continue;
      }

      if (key === "params") {
        i += 1;
        const params = [];
        while (i < lines.length) {
          const paramLine = lines[i];
          if (!paramLine.trim()) {
            i += 1;
            continue;
          }
          if (!paramLine.startsWith("  -")) {
            break;
          }
          const entry = {};
          const first = paramLine.replace(/^\s*-\s*/, "").trim();
          if (first) {
            const firstParts = first.split(/:\s*/);
            entry[firstParts[0]] = firstParts.slice(1).join(": ");
          }
          i += 1;
          while (i < lines.length && lines[i].startsWith("    ")) {
            const detail = lines[i].trim();
            if (detail) {
              const detailParts = detail.split(/:\s*/);
              entry[detailParts[0]] = detailParts.slice(1).join(": ");
            }
            i += 1;
          }
          params.push(entry);
        }
        data[key] = params;
        continue;
      }

      data[key] = rest;
      i += 1;
      continue;
    }

    i += 1;
  }

  return data;
}

function coerceValues(item) {
  if (Array.isArray(item.params)) {
    item.params = item.params.map((param) => {
      const next = { ...param };
      if (typeof next.optional === "string") {
        next.optional = next.optional === "true";
      }
      return next;
    });
  }
  return item;
}

function build() {
  if (!fs.existsSync(srcDir)) {
    throw new Error("src/custom directory not found.");
  }

  const files = fs.readdirSync(srcDir).filter((file) => file.endsWith(".js"));
  const items = files.map((file) => {
    const fullPath = path.join(srcDir, file);
    const content = fs.readFileSync(fullPath, "utf8");
    const frontmatter = extractFrontmatter(content);
    const data = frontmatter ? parseFrontmatter(frontmatter) : {};
    return coerceValues({
      file,
      slug: file.replace(/\.js$/, ""),
      ...data,
    });
  });

  const sorted = items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`Docs data written to ${path.relative(root, outFile)}`);
}

build();
